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
    public class EventsController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public EventsController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            return Ok(await _context.Events.ToListAsync());
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<Event>> GetEvent(string id)
        {
            var _event = await _context.Events.FindAsync(id);

            if (_event == null)
            {
                return NotFound();
            }

            return Ok(_event);
        }

        private bool EventExists(Guid id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}
