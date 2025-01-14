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
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessHoursController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public BusinessHoursController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/BusinessHours
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<BusinessHour>>> GetBusinessHours()
        {
            return Ok(await _context.BusinessHours.ToListAsync());
        }

        // GET: api/BusinessHours/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<BusinessHour>> GetBusinessHour(string id)
        {
            var businessHour = await _context.BusinessHours.FindAsync(id);

            if (businessHour == null)
            {
                return NotFound();
            }

            return Ok(businessHour);
        }

        // PUT: api/BusinessHours/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<IActionResult> PutBusinessHour(Guid id, BusinessHour businessHour)
        {
            if (id != businessHour.Id)
            {
                return BadRequest();
            }

            _context.Entry(businessHour).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusinessHourExists(id))
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

        // POST: api/BusinessHours
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<ActionResult<BusinessHour>> PostBusinessHour(BusinessHour businessHour)
        {
            _context.BusinessHours.Add(businessHour);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (BusinessHourExists(businessHour.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetBusinessHour", new { id = businessHour.Id }, businessHour);
        }

        // DELETE: api/BusinessHours/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<IActionResult> DeleteBusinessHour(string id)
        {
            var businessHour = await _context.BusinessHours.FindAsync(id);
            if (businessHour == null)
            {
                return NotFound();
            }

            _context.BusinessHours.Remove(businessHour);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusinessHourExists(Guid id)
        {
            return _context.BusinessHours.Any(e => e.Id == id);
        }
    }
}
