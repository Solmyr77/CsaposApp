using CsaposApi.Models;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
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

            // Validate password strength
            if (!IsPasswordStrong(registerUserDto.Password))
            {
                return BadRequest(new { Message = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number." });
            }

            // Check if the username is already taken
            bool usernameTaken = await _context.Users.AnyAsync(u => u.Username == registerUserDto.Username);

            if (usernameTaken)
            {
                return Conflict(new { Message = "Username is already taken." });
            }

            // Check if email is already taken
            bool emailTaken = await _context.Users.AnyAsync(u => u.Email == registerUserDto.Email);

            if (emailTaken)
            {
                return Conflict(new { Message = "User with this E-Mail already exists." });
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
                Email = registerUserDto.Email,
                DisplayName = registerUserDto.LegalName,
                PasswordHash = passwordHash,
                Salt = salt,
                LegalName = registerUserDto.LegalName,
                BirthDate = registerUserDto.BirthDate,
                Role = "guest",
                CreatedAt = DateTime.UtcNow,
                ImgUrl = $"{userId}.webp"
            };

            var response = new RegisterResponseDTO
            {
                Id = user.Id,
                Username = user.Username,
                LegalName = user.LegalName,
                BirthDate = user.BirthDate,
                Email = user.Email,
                imgUrl = user.ImgUrl,
            };

            // Add the user to the database context
            _context.Users.Add(user);

            // Save changes asynchronously
            await _context.SaveChangesAsync();

            // Return the created response with the user object
            return CreatedAtAction(nameof(Register), response);
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

        /// <summary>
        /// Update an existing password using a valid access token.
        /// </summary>
        /// <param name="refreshTokenRequestDto">Refresh token.</param>
        /// <returns>Ok on success, otherwise an error response.</returns>
        [HttpPut("update-password")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> UpdatePassword([FromBody][Required] PasswordUpdateDTO passwordUpdateDTO)
        {
            if (!ModelState.IsValid || passwordUpdateDTO == null)
            {
                return BadRequest(new
                {
                    error = "malformed_request",
                    message = "Request body is missing, malformed, or incomplete."
                });
            }

            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();

                var token = "";

                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                {
                    token = authHeader.Substring("Bearer ".Length).Trim();
                }
                else
                {
                    return Unauthorized("Token is malformed.");
                }

                // Validate password strength
                if (!IsPasswordStrong(passwordUpdateDTO.NewPassword))
                {
                    return BadRequest(new { Message = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number." });
                }

                Guid userId = Guid.Parse(_authService.GetUserId(token));

                var user = await _context.Users.FirstOrDefaultAsync(usr => usr.Id == userId);

                if (user == null)
                {
                    return NotFound(new
                    {
                        error = "user_not_found",
                        message = "The user associated with the token could not be found."
                    });
                }

                if (!_passwordService.VerifyPassword(passwordUpdateDTO.CurrentPassword, user.PasswordHash, user.Salt))
                {
                    return Unauthorized(new
                    {
                        error = "invalid_credentials",
                        message = "The current password is incorrect."
                    });
                }

                var newSalt = _passwordService.GenerateSalt();
                user.PasswordHash = _passwordService.HashPassword(passwordUpdateDTO.NewPassword, newSalt);
                user.Salt = newSalt;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Password updated successfully."
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
                    message = "An unexpected error occurred while updating the password.",
                });
            }
        }

        private bool IsPasswordStrong(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return false;

            var hasUpperCase = password.Any(char.IsUpper);
            var hasLowerCase = password.Any(char.IsLower);
            var hasDigit = password.Any(char.IsDigit);
            var isLongEnough = password.Length >= 8;

            return hasUpperCase && hasLowerCase && hasDigit && isLongEnough;
        }

    }
}
