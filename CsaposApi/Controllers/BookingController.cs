using CsaposApi.Models;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;
using static CsaposApi.Models.DTOs.AuthDTO;
using static CsaposApi.Models.DTOs.BookingDTO;
using static CsaposApi.Models.DTOs.TableGuestDTO;
using static CsaposApi.Models.DTOs.UserDTO;

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

        [HttpGet("bookings-by-user")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookingResponseWithGuestsDTO>>> GetTableBookings()
        {
            Guid currentUserId = GetUserIdFromToken();

            var bookings = await _context.TableBookings
                .Where(tb => tb.BookerId == currentUserId)
                .Select(tb => new BookingResponseWithGuestsDTO
                {
                    Id = tb.Id,
                    BookerId = tb.BookerId,
                    TableId = tb.TableId,
                    BookedFrom = tb.BookedFrom,
                    LocationId = tb.Table.LocationId,
                    TableGuests = tb.TableGuests.Select(tg => new GetProfileWithBookingStatusDTO
                    {
                        Id = tg.User.Id,
                        DisplayName = tg.User.DisplayName,
                        ImageUrl = tg.User.ImgUrl,
                        Status = tg.Status
                    }).ToList()
                })
                .ToListAsync();

            if (bookings == null || !bookings.Any())
                return NotFound();

            return Ok(bookings);
        }

        [HttpGet("bookings-containing-user")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(IEnumerable<BookingResponseDTO>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookingResponseWithGuestsDTO>>> GetBookingsWhereUserIsGuest()
        {
            Guid currentUserId = GetUserIdFromToken();

            var bookings = await _context.TableBookings
                .Where(tb => _context.TableGuests.Any(tg => tg.BookingId == tb.Id && tg.UserId == currentUserId) &&
                             tb.BookerId != currentUserId)
                .Select(tb => new BookingResponseWithGuestsDTO
                {
                    Id = tb.Id,
                    BookerId = tb.BookerId,
                    TableId = tb.TableId,
                    BookedFrom = tb.BookedFrom,
                    LocationId = tb.Table.LocationId,
                    TableGuests = tb.TableGuests.Select(tg => new GetProfileWithBookingStatusDTO
                    {
                        Id = tg.User.Id,
                        DisplayName = tg.User.DisplayName,
                        ImageUrl = tg.User.ImgUrl,
                        Status = tg.Status
                    }).ToList()
                })
                .ToListAsync();

            if (bookings.Count == 0)
                return NotFound(new { Message = "No bookings where the user is a guest." });

            return Ok(bookings);
        }

        [HttpGet("bookings-for-location")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookingResponseWithGuestsDTO>>> GetTableBookingsForLocation(Guid locationId)
        {
            var bookings = await _context.TableBookings
                .Include(tb => tb.Table)
                .Where(tb => tb.Table.LocationId == locationId)
                .Select(tb => new BookingResponseWithGuestsDTO
                {
                    Id = tb.Id,
                    BookerId = tb.BookerId,
                    TableId = tb.TableId,
                    BookedFrom = tb.BookedFrom,
                    LocationId = tb.Table.LocationId,
                    TableGuests = tb.TableGuests.Select(tg => new GetProfileWithBookingStatusDTO
                    {
                        Id = tg.User.Id,
                        DisplayName = tg.User.DisplayName,
                        ImageUrl = tg.User.ImgUrl,
                        Status = tg.Status
                    }).ToList()
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
        public async Task<ActionResult<BookingResponseDTO>> CreateBooking(CreateBookingDTO createBookingDTO)
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

                var response = new BookingResponseDTO
                {
                    Id = currentBooking.Id,
                    BookerId = currentBooking.BookerId,
                    TableId = currentBooking.TableId,
                    BookedFrom = currentBooking.BookedFrom,
                };

                var currentTable = await _context.Tables.FindAsync(currentBooking.TableId);

                currentTable.IsBooked = true;

                _context.Tables.Update(currentTable);
                await _context.TableBookings.AddAsync(currentBooking);
                await _context.SaveChangesAsync();

                return Ok(response);
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

        [HttpDelete("remove-booking")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NoContent)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Forbidden)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> RemoveBooking(DeleteBookingDTO deleteBookingDTO)
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
                string userRole = GetUserRoleFromToken();

                // Retrieve the booking once
                var currentBooking = await _context.TableBookings.FindAsync(deleteBookingDTO.BookingId);

                if (currentBooking == null)
                {
                    return NotFound(new
                    {
                        error = "not_found",
                        message = "Booking not found."
                    });
                }

                // Verify the booking belongs to the user or user is admin or manager
                if (currentBooking.BookerId != bookerId && userRole != "admin" && userRole != "manager")
                {
                    return Forbid();
                }

                // Retrieve the associated table
                var currentTable = await _context.Tables.FindAsync(currentBooking.TableId);

                if (currentTable == null)
                {
                    return NotFound(new
                    {
                        error = "not_found",
                        message = "Associated table not found."
                    });
                }

                // Mark the table as available
                currentTable.IsBooked = false;
                _context.Tables.Update(currentTable);

                // Remove the booking
                _context.TableBookings.Remove(currentBooking);

                await _context.SaveChangesAsync();

                return NoContent(); // HTTP 204
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while removing the booking." + ex.Message
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
                    .Where(x =>
                        (x.UserId1 == bookerId && addToTableDTO.userIds.Contains(x.UserId2)) ||
                        (x.UserId2 == bookerId && addToTableDTO.userIds.Contains(x.UserId1)))
                    .Select(x => x.UserId1 == bookerId ? x.UserId2 : x.UserId1)
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

                // Check if any of these users have already been added to the table
                var alreadyAddedUserIds = await _context.TableGuests
                    .Where(x => x.BookingId == addToTableDTO.bookingId && addToTableDTO.userIds.Contains((Guid)x.UserId))
                    .Select(x => x.UserId)
                    .ToListAsync();

                if (alreadyAddedUserIds.Any())
                {
                    return BadRequest(new
                    {
                        error = "duplicate_request",
                        message = "Some users have already been added to the table.",
                        alreadyAddedUserIds
                    });
                }

                var guestsToAdd = addToTableDTO.userIds.Select(userId => new TableGuest
                {
                    Id = Guid.NewGuid(),
                    BookingId = addToTableDTO.bookingId,
                    UserId = userId,
                    Status = "pending"
                }).ToList();

                await _context.TableGuests.AddRangeAsync(guestsToAdd);
                await _context.SaveChangesAsync();

                var profiles = await _context.TableGuests
                    .Where(x => x.BookingId == addToTableDTO.bookingId && addToTableDTO.userIds.Contains((Guid)x.UserId))
                    .Include(x => x.User) // eagerly load the User navigation property
                    .Select(g => new GetProfileDTO
                    {
                        Id = (Guid)g.UserId,
                        DisplayName = g.User.DisplayName,
                        ImageUrl = g.User.ImgUrl
                    })
                    .ToListAsync();

                return Ok(new
                {
                    BookingId = addToTableDTO.bookingId,
                    Profiles = profiles
                });
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
        [HttpPost("accept-invite")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> AcceptInvite(Guid bookingId)
        {
            try
            {
                Guid currentUserId = GetUserIdFromToken();

                var tableGuest = await _context.TableGuests
                    .FirstOrDefaultAsync(tg => tg.BookingId == bookingId && tg.UserId == currentUserId);

                if (tableGuest == null)
                {
                    return NotFound(new { error = "Invite not found." });
                }

                if (tableGuest.Status != "pending")
                {
                    return BadRequest(new { error = "Invite is not in a pending state." });
                }

                tableGuest.Status = "accepted";
                _context.TableGuests.Update(tableGuest);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Invite accepted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accepting invite.");
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while accepting the invite."
                });
            }
        }

        [HttpPost("reject-invite")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> RejectInvite(Guid bookingId)
        {
            try
            {
                Guid currentUserId = GetUserIdFromToken();

                var tableGuest = await _context.TableGuests
                    .FirstOrDefaultAsync(tg => tg.BookingId == bookingId && tg.UserId == currentUserId);

                if (tableGuest == null)
                {
                    return NotFound(new { error = "Invite not found." });
                }

                if (tableGuest.Status != "pending")
                {
                    return BadRequest(new { error = "Invite is not in a pending state." });
                }

                tableGuest.Status = "rejected";
                _context.TableGuests.Update(tableGuest);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Invite rejected successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting invite.");
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while rejecting the invite."
                });
            }
        }

        [HttpGet("pending-invites")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(IEnumerable<BookingResponseWithGuestsDTO>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<IEnumerable<BookingResponseWithGuestsDTO>>> GetPendingInvites()
        {
            try
            {
                Guid currentUserId = GetUserIdFromToken();

                var pendingInvites = await _context.TableGuests
                    .Where(tg => tg.UserId == currentUserId && tg.Status == "pending")
                    .Select(tg => new BookingResponseWithGuestsDTO
                    {
                        Id = (Guid)tg.BookingId,
                        BookerId = tg.Booking.BookerId,
                        TableId = tg.Booking.TableId,
                        BookedFrom = tg.Booking.BookedFrom,
                        LocationId = tg.Booking.Table.LocationId,
                        TableGuests = tg.Booking.TableGuests.Select(g => new GetProfileWithBookingStatusDTO
                        {
                            Id = g.User.Id,
                            DisplayName = g.User.DisplayName,
                            ImageUrl = g.User.ImgUrl,
                            Status = g.Status
                        }).ToList()
                    })
                    .ToListAsync();

                if (pendingInvites == null || !pendingInvites.Any())
                    return NotFound(new { Message = "No pending invites found." });

                return Ok(pendingInvites);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pending invites.");
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = "An unexpected error occurred while retrieving pending invites."
                });
            }
        }
    }
}
