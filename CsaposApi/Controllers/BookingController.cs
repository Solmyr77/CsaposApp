using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using static CsaposApi.Models.DTOs.AuthDTO;
using static CsaposApi.Models.DTOs.BookingDTO;

namespace CsaposApi.Controllers
{
    [Route("api/booking")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public BookingController(CsaposappContext context)
        {
            _context = context;
        }

        [HttpPost]
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
                var currentBooking = new TableBooking
                {
                    Id = Guid.NewGuid(),
                    TableId = createBookingDTO.TableId,
                    BookerId = createBookingDTO.BookerId,
                    BookedFrom = createBookingDTO.BookedFrom,
                    BookedTo = createBookingDTO.BookedTo
                };

                await _context.TableBookings.AddAsync(currentBooking);
                await _context.SaveChangesAsync();

                return Ok();
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
