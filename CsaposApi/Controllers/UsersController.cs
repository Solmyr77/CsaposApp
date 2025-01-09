using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using static CsaposApi.Models.DTOs.ProductDTO;
using static CsaposApi.Models.DTOs.UserDTO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Configuration;
using Microsoft.Extensions.Configuration;


namespace CsaposApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(CsaposappContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Registration endpoint
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterUserDTO registerUserDTO)
        {
            if (await _context.Users.AnyAsync(u => u.Username == registerUserDTO.Username))
            {
                return Conflict("Username is already taken.");
            }

            var salt = GenerateSalt();

            var passwordHash = HashPassword(registerUserDTO.Password, salt);

            Guid currentGuid = Guid.NewGuid();

            User user = new User
            {
                Id = currentGuid,
                Username = registerUserDTO.Username,
                PasswordHash = passwordHash,
                Salt = salt,
                LegalName = registerUserDTO.LegalName,
                BirthDate = registerUserDTO.BirthDate,
                Role = "guest",
                CreatedAt = DateTime.UtcNow,
                ImgUrl = $"{currentGuid}.webp"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // Login endpoint
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginUserDTO loginUserDTO)
        {
            // 1) Check if user exists
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginUserDTO.Username);
            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // 2) Validate password
            var passwordHash = HashPassword(loginUserDTO.Password, user.Salt);
            if (passwordHash != user.PasswordHash)
            {
                return Unauthorized("Invalid username or password.");
            }

            // 3) Generate JWT token
            var token = GenerateJwtToken(user);

            // 4) Return token
            return Ok(new { token });
        }

        private string GenerateSalt()
        {
            var saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        private string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var saltedPassword = password + salt;
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                return Convert.ToBase64String(hashBytes);
            }
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // Example of a method to generate a JWT token
        private string GenerateJwtToken(User user)
        {
            // Get values from appsettings or environment
            var key = _configuration["Jwt:Key"];       // or inject via constructor
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            // Create a security key and credentials
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create user-specific claims (you can add more if needed)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("role", user.Role),
                new Claim("userId", user.Id.ToString()),
                // You can add additional claims as needed
            };

            // Create the token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2), // or however long you want it valid
                signingCredentials: credentials
            );

            // Return the signed JWT token string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
