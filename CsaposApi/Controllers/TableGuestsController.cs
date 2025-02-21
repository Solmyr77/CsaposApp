using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using static CsaposApi.Models.DTOs.TableGuestDTO;

namespace CsaposApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TableGuestsController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public TableGuestsController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/TableGuests
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<TableGuest>>> GetTableGuests()
        {
            return Ok(await _context.TableGuests.ToListAsync());
        }

        // GET: api/TableGuests/5
        [HttpGet("{booking-id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<TableGuest>> GetTableGuest(Guid bookingId)
        {
            var tableGuest = await _context.TableGuests.FirstOrDefaultAsync(x => x.BookingId == bookingId);

            if (tableGuest == null)
            {
                return NotFound();
            }

            var response = new TableGuestResponseDTO
            {
                Id = tableGuest.Id,
                UserId = tableGuest.UserId,
                BookingId = tableGuest.BookingId,
            };

            return Ok(response);
        }

        private bool TableGuestExists(Guid id)
        {
            return _context.TableGuests.Any(e => e.Id == id);
        }
    }
}
