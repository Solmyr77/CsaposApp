using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;

namespace CsaposApi.Controllers
{
    [Route("api/[controller]")]
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
        public async Task<ActionResult<IEnumerable<EventAttendance>>> GetEventAttendances()
        {
            return Ok(await _context.EventAttendances.ToListAsync());
        }

        // GET: api/EventAttendances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventAttendance>> GetEventAttendance(string id)
        {
            var eventAttendance = await _context.EventAttendances.FindAsync(id);

            if (eventAttendance == null)
            {
                return NotFound();
            }

            return Ok(eventAttendance);
        }

        // PUT: api/EventAttendances/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEventAttendance(Guid id, EventAttendance eventAttendance)
        {
            if (id != eventAttendance.Id)
            {
                return BadRequest();
            }

            _context.Entry(eventAttendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventAttendanceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/EventAttendances
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EventAttendance>> PostEventAttendance(EventAttendance eventAttendance)
        {
            _context.EventAttendances.Add(eventAttendance);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EventAttendanceExists(eventAttendance.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEventAttendance", new { id = eventAttendance.Id }, eventAttendance);
        }

        // DELETE: api/EventAttendances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventAttendance(string id)
        {
            var eventAttendance = await _context.EventAttendances.FindAsync(id);
            if (eventAttendance == null)
            {
                return NotFound();
            }

            _context.EventAttendances.Remove(eventAttendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventAttendanceExists(Guid id)
        {
            return _context.EventAttendances.Any(e => e.Id == id);
        }
    }
}
