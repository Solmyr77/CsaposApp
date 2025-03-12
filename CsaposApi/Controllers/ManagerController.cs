using CsaposApi.Models;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CsaposApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly IPasswordService _passwordService;
        private readonly ILogger<BookingController> _logger;

        public ManagerController(
            CsaposappContext context,
            IAuthService authService,
            IPasswordService passwordService,
            ILogger<BookingController> logger)
        {
            _context = context;
            _authService = authService;
            _passwordService = passwordService;
            _logger = logger;
        }

        // Extract user ID from JWT token using AuthService
        private Guid GetUserIdFromToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    throw new UnauthorizedAccessException("Missing Authorization token.");
                }

                var userIdString = _authService.GetUserId(token);
                return Guid.Parse(userIdString);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt due to missing token.");
                throw;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid token format.");
                throw new UnauthorizedAccessException("Invalid token format: " + ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to extract user ID from token.");
                throw new UnauthorizedAccessException("Failed to extract user ID from token.");
            }
        }

        // Extract user role from JWT token using AuthService
        private string GetUserRoleFromToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    throw new UnauthorizedAccessException("Missing Authorization token.");
                }

                var userRole = _authService.GetUserRole(token);
                return userRole;
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt due to missing token.");
                throw;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid token format.");
                throw new UnauthorizedAccessException("Invalid token format: " + ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to extract role from token.");
                throw new UnauthorizedAccessException("Failed to extract role from token.");
            }
        }

        [HttpGet("manager-location")]
        public IActionResult GetManagerLocation()
        {
            if (GetUserRoleFromToken() != "manager")
            {
                return Forbid();
            }

            var manager = _context.ManagerMappings.FirstOrDefault(x => x.UserId == GetUserIdFromToken());

            if (manager == null)
            {
                return NotFound();
            }

            return Ok(manager.LocationId);
        }
    }
}
