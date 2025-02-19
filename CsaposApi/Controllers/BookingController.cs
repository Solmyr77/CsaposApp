using CsaposApi.Models;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using static CsaposApi.Models.DTOs.AuthDTO;
using static CsaposApi.Models.DTOs.BookingDTO;

namespace CsaposApi.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<BookingController> _logger;

        public BookingController(CsaposappContext context, IAuthService authService, ILogger<BookingController> logger)
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

        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookingResponseDTO>>> GetTableBookings()
        {
            var bookings = await _context.TableBookings
                .Select(tb => new BookingResponseDTO
                {
                    Id = tb.Id,
                    BookerId = tb.BookerId,
                    TableId = tb.TableId,
                    BookedFrom = tb.BookedFrom,
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("{bookerId}")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookingResponseDTO>>> GetTableBookings(Guid bookerId)
        {
            var bookings = await _context.TableBookings
                .Where(tb => tb.BookerId == bookerId)
                .Select(tb => new BookingResponseDTO
                {
                    Id = tb.Id,
                    BookerId = tb.BookerId,
                    TableId = tb.TableId,
                    BookedFrom = tb.BookedFrom,
                })
                .ToListAsync();

            if (bookings == null || !bookings.Any())
                return NotFound();

            return Ok(bookings);
        }

        [HttpPost("book-table")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> CreateBooking(CreateBookingDTO createBookingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    error = "invalid_request",
                    message = "Request body is missing, malformed, or incomplete."
                });
            }

            try
            {
                Guid bookerId = GetUserIdFromToken();

                var currentBooking = new TableBooking
                {
                    Id = Guid.NewGuid(),
                    TableId = createBookingDTO.TableId,
                    BookerId = bookerId,
                    BookedFrom = createBookingDTO.BookedFrom,
                };

                await _context.TableBookings.AddAsync(currentBooking);
                await _context.SaveChangesAsync();

                return Ok(currentBooking);
            }
            catch (Exception)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while creating the booking."
                });
            }
        }

        [HttpPost("add-to-table")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> AddToTable(AddToTableDTO addToTableDTO)
        {
            if (!ModelState.IsValid || addToTableDTO.userIds == null || !addToTableDTO.userIds.Any())
            {
                return BadRequest(new
                {
                    error = "invalid_request",
                    message = "Request body is missing, malformed, or incomplete."
                });
            }

            try
            {
                Guid bookerId = GetUserIdFromToken();

                // Check if all users are friends
                var friendsList = await _context.Friendships
                    .Where(x => x.UserId1 == bookerId && addToTableDTO.userIds.Contains(x.UserId2))
                    .Select(x => x.UserId2)
                    .ToListAsync();

                var notFriends = addToTableDTO.userIds.Except(friendsList).ToList();

                if (notFriends.Any())
                {
                    return Unauthorized(new
                    {
                        error = "invalid_request",
                        message = "All users to add must be on the friends list.",
                        notAllowedUserIds = notFriends
                    });
                }

                var guestsToAdd = addToTableDTO.userIds.Select(userId => new TableGuest
                {
                    Id = Guid.NewGuid(),
                    BookingId = addToTableDTO.bookingId,
                    UserId = userId
                }).ToList();

                await _context.TableGuests.AddRangeAsync(guestsToAdd);
                await _context.SaveChangesAsync();

                return Ok(guestsToAdd);
            }
            catch (Exception)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while adding the guests to the table."
                });
            }
        }


        [HttpDelete("remove-from-table")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> RemoveFromTable(RemoveFromTableDTO removeFromTableDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    error = "invalid_request",
                    message = "Request body is missing, malformed, or incomplete."
                });
            }

            try
            {
                // Get the current user ID from the token
                Guid currentUserId = GetUserIdFromToken();

                // Retrieve the booking
                var booking = await _context.TableBookings.FirstOrDefaultAsync(tb => tb.Id == removeFromTableDTO.BookingId);
                if (booking == null)
                {
                    return NotFound(new { error = "Booking not found." });
                }

                // Check if the user being removed is the current user
                if (removeFromTableDTO.UserId != currentUserId)
                {
                    // If trying to remove someone else, ensure that the current user is the booking owner
                    if (booking.BookerId != currentUserId)
                    {
                        return Unauthorized(new { error = "Only the booking owner can remove other guests." });
                    }
                }

                // Find the table guest record for the specified booking and user
                var tableGuest = await _context.TableGuests.FirstOrDefaultAsync(tg =>
                    tg.BookingId == removeFromTableDTO.BookingId && tg.UserId == removeFromTableDTO.UserId);
                if (tableGuest == null)
                {
                    return NotFound(new { error = "Guest not found for this booking." });
                }

                _context.TableGuests.Remove(tableGuest);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Guest removed from the table successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing guest from table.");
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while removing the guest."
                });
            }
        }
    }
}
