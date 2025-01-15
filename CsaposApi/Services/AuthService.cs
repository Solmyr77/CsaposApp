using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;
using CsaposApi.Services.IService;
using CsaposApi.Models;
using Microsoft.EntityFrameworkCore;

public class AuthService : IAuthService
{
    private readonly JwtSettings _jwtSettings;
    private readonly CsaposappContext _context;

    public AuthService(CsaposappContext context, IOptions<JwtSettings> jwtSettingsOptions)
    {
        _jwtSettings = jwtSettingsOptions.Value;
        _context = context;
    }

    public async Task<TokenResponse> GenerateTokenPairAsync(Guid userId)
    {
        // 1. Generate Access Token
        var accessToken = GenerateAccessToken(userId);
        var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes);

        // 2. Generate Refresh Token
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N"),
            UserId = userId,
            Expiration = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays),
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);

        await _context.SaveChangesAsync();

        // Construct response
        return new TokenResponse
        {
            AccessToken = accessToken,
            AccessTokenExpiry = accessTokenExpiry,
            RefreshToken = refreshToken.Token,
            RefreshTokenExpiry = refreshToken.Expiration
        };
    }

    public async Task<string> RefreshAccessTokenAsync(string refreshTokenValue)
    {
        var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshTokenValue);

        if (refreshToken == null || refreshToken.IsRevoked || refreshToken.Expiration < DateTime.UtcNow)
        {
            throw new SecurityTokenException("Invalid or expired refresh token");
        }

        var newToken = GenerateAccessToken(refreshToken.UserId);

        return newToken;
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        // 1) Find the refresh token in the database
        var storedToken = await _context.RefreshTokens
            .SingleOrDefaultAsync(rt => rt.Token == refreshToken);

        // 2) If not found or already revoked, you might want to do nothing or throw an exception
        if (storedToken == null)
        {
            return;
        }

        if (storedToken.IsRevoked)
        {
            return;
        }

        // 3) Mark it as revoked
        storedToken.IsRevoked = true;

        // 4) Save changes
        _context.RefreshTokens.Update(storedToken);
        await _context.SaveChangesAsync();
    }

    private string GenerateAccessToken(Guid userId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, _context.Users.FirstOrDefault(x => x.Id == userId).Role)
        };

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes),
            signingCredentials: credentials
        );

        return tokenHandler.WriteToken(token);
    }
}
