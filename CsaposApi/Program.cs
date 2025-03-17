using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CsaposApi.Services.IService;
using CsaposApi.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authorization;
using CsaposApi.Hubs;

namespace CsaposApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSignalR();

            // Swagger Security
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Csapos API", Version = "v1" });

                // 1. Add Bearer authentication definition
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header. Example: \"Bearer {token}\""
                });

                // 2. Apply global security requirement
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // Authorization policies
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("MustBeGuest", policy => policy.RequireRole("guest", "admin", "manager"));
                options.AddPolicy("MustBeAdmin", policy => policy.RequireRole("admin"));
                options.AddPolicy("MustBeManager", policy => policy.RequireRole("manager", "admin"));
            });

            // Services
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IPasswordService, PasswordService>();
            builder.Services.AddScoped<IFriendshipService, FriendshipService>();
            builder.Services.AddScoped<IBookingNotificationService, BookingNotificationService>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            builder.Services.AddSingleton<IConnectionManager, ConnectionManager>();

            // 1. Bind JWT settings
            var jwtSection = builder.Configuration.GetSection("JwtSettings");
            builder.Services.Configure<JwtSettings>(jwtSection);
            var jwtSettings = jwtSection.Get<JwtSettings>();

            // 2. Register Authentication
            var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    ClockSkew = TimeSpan.Zero
                };

                // Allow JWT tokens to be sent via WebSockets
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/hubs/notifications") || path.StartsWithSegments("/hubs/booking")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            // Database
            builder.Services.AddDbContext<CsaposappContext>(options =>
            {
                var connectionString = builder.Configuration.GetConnectionString("MySql");
                options.UseMySQL(connectionString);
            });

            // JSON serialization fixes
            builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            // CORS (Allow only frontend domain)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("https://csaposapp.hu", "https://localhost:3000", "http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials(); // WebSockets require credentials
                });
            });

            var app = builder.Build();

            app.UseDeveloperExceptionPage();

            // Swagger UI
            app.UseSwagger();
            app.UseSwaggerUI();

            // Use CORS policy
            app.UseCors("AllowFrontend");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // SignalR Hubs with Correct CORS Policy
            app.MapHub<NotificationHub>("/hubs/notifications");
            app.MapHub<BookingHub>("/hubs/booking");

            app.Run();
        }
    }
}