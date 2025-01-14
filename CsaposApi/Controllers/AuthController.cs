using CsaposApi.Models;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using static CsaposApi.Models.DTOs.UserDTO;

namespace CsaposApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly IPasswordService _passwordService;

        public AuthController(CsaposappContext context, IAuthService authService, IPasswordService passwordService)
        {
            _context = context;
            _authService = authService;
            _passwordService = passwordService;
        }

        // Login endpoint
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> Login(LoginUserDTO loginUserDTO)
        {
            // 1) Check if user exists
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginUserDTO.Username);
            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // 2) Validate password
            var passwordHash = _passwordService.HashPassword(loginUserDTO.Password, user.Salt);
            if (passwordHash != user.PasswordHash)
            {
                return Unauthorized("Invalid username or password.");
            }

            var tokenResponse = await _authService.GenerateTokenPair(user.Id);

            return Ok(tokenResponse);
        }

        // Registration endpoint
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Register(RegisterUserDTO registerUserDTO)
        {
            // Check if the username is already taken
            if (await _context.Users.AnyAsync(u => u.Username == registerUserDTO.Username))
            {
                return Conflict(new { Message = "Username is already taken." });
            }

            // Generate salt and hash the password
            var salt = _passwordService.GenerateSalt();
            var passwordHash = _passwordService.HashPassword(registerUserDTO.Password, salt);

            // Generate a new GUID for the user
            var userId = Guid.NewGuid();

            // Create a new User instance
            var user = new User
            {
                Id = userId,
                Username = registerUserDTO.Username,
                PasswordHash = passwordHash,
                Salt = salt,
                LegalName = registerUserDTO.LegalName,
                BirthDate = registerUserDTO.BirthDate,
                Role = "guest",
                CreatedAt = DateTime.UtcNow,
                ImgUrl = $"{userId}.webp"
            };

            // Add the user to the database context
            _context.Users.Add(user);

            // Save changes asynchronously
            await _context.SaveChangesAsync();

            // Return the created response with the user object
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }
    }
}
