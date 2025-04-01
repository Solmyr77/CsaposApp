using CsaposApi.Models;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CsaposApi.Models.DTOs.RatingDTO;

namespace CsaposApi.Controllers
{
    [Route("api/ratings")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<BookingController> _logger;

        public RatingsController(
            CsaposappContext context,
            IAuthService authService,
            ILogger<BookingController> logger)
        {
            _context = context;
            _authService = authService;
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

        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> GetById(Guid locationId)
        {
            var ratingAverage = await _context.LocationRatings.Where(x => x.LocationId == locationId).AverageAsync(x => x.Rating);

            return Ok(new { Rating = ratingAverage });
        }

        [HttpPost]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> CreateRating(CreateRatingDTO createRatingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    error = "invalid_request",
                    message = "Request body is missing, malformed, or incomplete."
                });
            }

            if (GetUserRoleFromToken() == "manager")
            {
                return Forbid("Managers cannot rate locations.");
            }

            var locationRating = new LocationRating
            {
                Id = Guid.NewGuid(),
                UserId = GetUserIdFromToken(),
                LocationId = createRatingDTO.LocationId,
                Rating = createRatingDTO.Rating
            };

            _context.LocationRatings.Add(locationRating);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateRating), locationRating);
        }
    }
}
