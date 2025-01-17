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

        private bool TableGuestExists(Guid id)
        {
            return _context.TableGuests.Any(e => e.Id == id);
        }
    }
}
