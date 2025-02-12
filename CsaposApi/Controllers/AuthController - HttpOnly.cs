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
    [Route("api/do-not-use")]
    public class AuthControllerHttpOnly : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly IPasswordService _passwordService;

        public AuthControllerHttpOnly(
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

            Response.Cookies.Append("access_token", tokenResponse.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15) // Match token expiration
            });

            Response.Cookies.Append("refresh_token", tokenResponse.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7) // Match refresh token expiration
            });

            return Ok(new { message = "Login successful" });
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
                DisplayName = registerUserDto.LegalName,
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
                Response.Cookies.Append("access_token", "", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddSeconds(-1) // Expire immediately
                });

                Response.Cookies.Append("refresh_token", "", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddSeconds(-1)
                });

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

                Response.Cookies.Append("access_token", accessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(15) // Adjust expiration as needed
                });

                return Ok(new { message = "Token refreshed successfully" });
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
            if (!ModelState.IsValid || passwordUpdateDTO == null || string.IsNullOrWhiteSpace(passwordUpdateDTO.AccessToken))
            {
                return BadRequest(new
                {
                    error = "malformed_request",
                    message = "Request body is missing, malformed, or incomplete."
                });
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();

                if (!tokenHandler.CanReadToken(passwordUpdateDTO.AccessToken))
                {
                    return Unauthorized(new
                    {
                        error = "invalid_token",
                        message = "The access token is invalid or unreadable."
                    });
                }

                var tokenObject = tokenHandler.ReadJwtToken(passwordUpdateDTO.AccessToken);
                var subClaimValue = tokenObject.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

                if (string.IsNullOrWhiteSpace(subClaimValue) || !Guid.TryParse(subClaimValue, out Guid subClaim))
                {
                    return Unauthorized(new
                    {
                        error = "invalid_token",
                        message = "The token does not contain a valid subject claim."
                    });
                }

                var user = await _context.Users.FirstOrDefaultAsync(usr => usr.Id == subClaim);

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

    }
}
