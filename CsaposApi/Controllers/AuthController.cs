using CsaposApi.Models;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text;
using static CsaposApi.Models.DTOs.AuthDTO;
using static CsaposApi.Models.DTOs.UserDTO;

namespace CsaposApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly IPasswordService _passwordService;

        public AuthController(
            CsaposappContext context,
            IAuthService authService,
            IPasswordService passwordService)
        {
            _context = context;
            _authService = authService;
            _passwordService = passwordService;
        }

        /// <summary>
        /// Logs in a user using their credentials.
        /// </summary>
        /// <param name="loginUserDto">Username and password.</param>
        /// <returns>An access and refresh token pair on success.</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(TokenResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ValidationProblemDetails), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Login([FromBody][Required] LoginUserDTO loginUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1) Check if user exists
            var user = await _context.Users
                .AsNoTracking()
                .SingleOrDefaultAsync(u => u.Username == loginUserDto.Username);

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // 2) Validate password
            var passwordHash = _passwordService.HashPassword(loginUserDto.Password, user.Salt);
            if (passwordHash != user.PasswordHash)
            {
                return Unauthorized("Invalid username or password.");
            }

            // 3) Generate token pair
            var tokenResponse = await _authService.GenerateTokenPairAsync(user.Id);

            return Ok(tokenResponse);
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="registerUserDto">User registration data.</param>
        /// <returns>The newly created user.</returns>
        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(User), (int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Conflict)]
        [ProducesResponseType(typeof(ValidationProblemDetails), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Register([FromBody][Required] RegisterUserDTO registerUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the username is already taken
            bool usernameTaken = await _context.Users
                .AnyAsync(u => u.Username == registerUserDto.Username);

            if (usernameTaken)
            {
                return Conflict(new { Message = "Username is already taken." });
            }

            // Generate salt and hash the password
            var salt = _passwordService.GenerateSalt();
            var passwordHash = _passwordService.HashPassword(registerUserDto.Password, salt);

            // Generate a new GUID for the user
            var userId = Guid.NewGuid();

            // Create a new User instance
            var user = new User
            {
                Id = userId,
                Username = registerUserDto.Username,
                PasswordHash = passwordHash,
                Salt = salt,
                LegalName = registerUserDto.LegalName,
                BirthDate = registerUserDto.BirthDate,
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

        /// <summary>
        /// Logs out a user by invalidating the provided refresh token.
        /// </summary>
        /// <param name="logoutRequestDto">Refresh token to be revoked.</param>
        /// <returns>No content on success, otherwise an error response.</returns>
        [HttpPost("logout")]
        [AllowAnonymous]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Logout([FromBody][Required] LogoutRequestDTO logoutRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // The service layer should handle revoking the token in your database or token store.
                await _authService.RevokeRefreshTokenAsync(logoutRequestDto.RefreshToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = $"An unexpected error occurred while logging out. {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Refreshes an existing access token using a valid refresh token.
        /// </summary>
        /// <param name="refreshTokenRequestDto">Refresh token.</param>
        /// <returns>A new access token.</returns>
        [HttpPost("refresh-token")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> RefreshAccessToken([FromBody][Required] RefreshTokenRequestDTO refreshTokenRequestDto)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(refreshTokenRequestDto.RefreshToken))
            {
                return BadRequest(new
                {
                    error = "missing_token",
                    message = "Refresh token is missing or malformed."
                });
            }

            try
            {
                var accessToken = await _authService.RefreshAccessTokenAsync(refreshTokenRequestDto.RefreshToken);

                return Ok(new
                {
                    accessToken
                });
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(new
                {
                    error = "invalid_token",
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while refreshing the token."
                });
            }
        }
    }
}
