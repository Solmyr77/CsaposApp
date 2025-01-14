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
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<TableGuest>> GetTableGuest(string id)
        {
            var tableGuest = await _context.TableGuests.FindAsync(id);

            if (tableGuest == null)
            {
                return NotFound();
            }

            return Ok(tableGuest);
        }

        // PUT: api/TableGuests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<IActionResult> PutTableGuest(Guid id, TableGuest tableGuest)
        {
            if (id != tableGuest.Id)
            {
                return BadRequest();
            }

            _context.Entry(tableGuest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableGuestExists(id))
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

        // POST: api/TableGuests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<ActionResult<TableGuest>> PostTableGuest(TableGuest tableGuest)
        {
            _context.TableGuests.Add(tableGuest);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TableGuestExists(tableGuest.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTableGuest", new { id = tableGuest.Id }, tableGuest);
        }

        // DELETE: api/TableGuests/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<IActionResult> DeleteTableGuest(string id)
        {
            var tableGuest = await _context.TableGuests.FindAsync(id);
            if (tableGuest == null)
            {
                return NotFound();
            }

            _context.TableGuests.Remove(tableGuest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TableGuestExists(Guid id)
        {
            return _context.TableGuests.Any(e => e.Id == id);
        }
    }
}
