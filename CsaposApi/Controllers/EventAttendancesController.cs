using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace CsaposApi.Controllers
{
    [Route("api/event-attendances")]
    [ApiController]
    public class EventAttendancesController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public EventAttendancesController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/EventAttendances
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<EventAttendance>>> GetEventAttendances()
        {
            return Ok(await _context.EventAttendances.ToListAsync());
        }

        // GET: api/EventAttendances/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<EventAttendance>> GetEventAttendance(string id)
        {
            var eventAttendance = await _context.EventAttendances.FindAsync(id);

            if (eventAttendance == null)
            {
                return NotFound();
            }

            return Ok(eventAttendance);
        }

        private bool EventAttendanceExists(Guid id)
        {
            return _context.EventAttendances.Any(e => e.Id == id);
        }
    }
}
