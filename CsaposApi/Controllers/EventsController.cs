using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using static CsaposApi.Models.DTOs.LocationDTO;
using System.Net;
using static CsaposApi.Models.DTOs.EventDTO;

namespace CsaposApi.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public EventsController(CsaposappContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            return Ok(await _context.Events.Select(ev => new EventResponseDTO
            {
                Id = ev.Id,
                LocationId = (Guid)ev.LocationId,
                Name = ev.Name,
                Description = ev.Description,
                Timefrom = ev.Timefrom,
                Timeto = ev.Timeto,
                ImgUrl = ev.ImgUrl
            }).ToListAsync());
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<Event>> GetEvent(Guid id)
        {
            var currentEvent = await _context.Events.FindAsync(id);

            if (currentEvent == null)
            {
                return NotFound();
            }

            var response = new EventResponseDTO
            {
                Id = currentEvent.Id,
                LocationId = (Guid)currentEvent.LocationId,
                Name = currentEvent.Name,
                Description = currentEvent.Description,
                Timefrom = currentEvent.Timefrom,
                Timeto = currentEvent.Timeto,
                ImgUrl = currentEvent.ImgUrl
            };

            return Ok(response);
        }

        [HttpGet("location/{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<Event>> GetEventsByLocation(Guid locationId)
        {
            return Ok(await _context.Events.Where(x => x.LocationId == locationId).Select(ev => new EventResponseDTO
            {
                Id = ev.Id,
                LocationId = (Guid)ev.LocationId,
                Name = ev.Name,
                Description = ev.Description,
                Timefrom = ev.Timefrom,
                Timeto = ev.Timeto,
                ImgUrl = ev.ImgUrl
            }).ToListAsync());
        }

        [HttpPost]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> CreateEvent(CreateEventDTO createEventDTO)
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
                var eventId = Guid.NewGuid();

                var currentEvent = new Event
                {
                    Id = eventId,
                    Name = createEventDTO.Name,
                    Description = createEventDTO.Description,
                    LocationId = createEventDTO.LocationId,
                    Timefrom = createEventDTO.Timefrom,
                    Timeto = createEventDTO.Timeto,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    ImgUrl = $"{eventId}.webp"
                };

                await _context.Events.AddAsync(currentEvent);
                await _context.SaveChangesAsync();

                var response = new EventResponseDTO
                {
                    Id = currentEvent.Id,
                    LocationId = (Guid)currentEvent.LocationId,
                    Name = currentEvent.Name,
                    Description = currentEvent.Description,
                    Timefrom = currentEvent.Timefrom,
                    Timeto = currentEvent.Timeto,
                    ImgUrl = currentEvent.ImgUrl
                };

                return CreatedAtAction(nameof(CreateEvent), response);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    message = e.Message,
                });
            }
        }

        private bool EventExists(Guid id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}
