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
using CsaposApi.Services.IService;
using Microsoft.Extensions.Logging;

namespace CsaposApi.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly ILogger<EventsController> _logger;
        private readonly IAuthService _authService;

        public EventsController(CsaposappContext context, IAuthService authService, ILogger<EventsController> logger)
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

        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<EventResponseDTO>>> GetEvents()
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
        public async Task<ActionResult<EventResponseDTO>> GetEvent(Guid id)
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

        // GET: api/events/accepted-by-user
        // Returns the events that the current user has accepted (via EventAttendances)
        [HttpGet("accepted-by-user")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<EventResponseDTO>>> GetEventsByUser()
        {
            var userId = GetUserIdFromToken();

            var events = await _context.Events
                .Include(x => x.EventAttendances)
                .Where(x => x.EventAttendances.Any(ea => ea.UserId == userId && ea.Status == "accepted"))
                .Select(ev => new EventResponseDTO
                {
                    Id = ev.Id,
                    LocationId = (Guid)ev.LocationId,
                    Name = ev.Name,
                    Description = ev.Description,
                    Timefrom = ev.Timefrom,
                    Timeto = ev.Timeto,
                    ImgUrl = ev.ImgUrl
                }).ToListAsync();

            return Ok(events);
        }

        [HttpGet("location/{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<EventResponseDTO>>> GetEventsByLocation(Guid locationId)
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

                return CreatedAtAction(nameof(GetEvent), new { id = currentEvent.Id }, response);
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
