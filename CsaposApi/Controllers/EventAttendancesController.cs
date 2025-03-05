using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using static CsaposApi.Models.DTOs.EventAttendanceDTO;
using static CsaposApi.Models.DTOs.EventDTO;
using CsaposApi.Services.IService;
using Microsoft.Extensions.Logging;

namespace CsaposApi.Controllers
{
    [Route("api/event-attendances")]
    [ApiController]
    public class EventAttendancesController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<EventAttendancesController> _logger;

        public EventAttendancesController(CsaposappContext context, IAuthService authService, ILogger<EventAttendancesController> logger)
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

        // GET: api/EventAttendances
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<EventAttendance>>> GetEventAttendances()
        {
            return Ok(await _context.EventAttendances.Include(x => x.Event).Select(ea => new EventAttendanceResponseDTO
            {
                Id = ea.Id,
                Event = new EventResponseDTO
                {
                    Id = ea.Event.Id,
                    LocationId = (Guid)ea.Event.LocationId,
                    Name = ea.Event.Name,
                    Description = ea.Event.Description,
                    ImgUrl = ea.Event.ImgUrl,
                    Timefrom = ea.Event.Timefrom,
                    Timeto = ea.Event.Timeto
                },
                UserId = (Guid)ea.UserId,
                Status = ea.Status
            }).ToListAsync());
        }

        // GET: api/EventAttendances/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<EventAttendance>> GetEventAttendance(Guid id)
        {
            var currentEventAttendance = await _context.EventAttendances.Include(x => x.Event).FirstOrDefaultAsync(x => x.Id == id);

            if (currentEventAttendance == null)
            {
                return NotFound();
            }

            var response = new EventAttendanceResponseDTO
            {
                Id = currentEventAttendance.Id,
                Event = new EventResponseDTO
                {
                    Id = currentEventAttendance.Event.Id,
                    LocationId = (Guid)currentEventAttendance.Event.LocationId,
                    Name = currentEventAttendance.Event.Name,
                    Description = currentEventAttendance.Event.Description,
                    ImgUrl = currentEventAttendance.Event.ImgUrl,
                    Timefrom = currentEventAttendance.Event.Timefrom,
                    Timeto = currentEventAttendance.Event.Timeto
                },
                UserId = (Guid)currentEventAttendance.UserId,
                Status = currentEventAttendance.Status
            };

            return Ok(response);
        }

        [HttpGet("location/{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<EventAttendance>> GetEventAttendanceByLocation(Guid locationId)
        {
            var currentEventAttendances = _context.EventAttendances.Include(x => x.Event).Where(x => x.Event.LocationId == locationId).Select(ea => new EventAttendanceResponseDTO
            {
                Id = ea.Id,
                Event = new EventResponseDTO
                {
                    Id = ea.Event.Id,
                    LocationId = (Guid)ea.Event.LocationId,
                    Name = ea.Event.Name,
                    Description = ea.Event.Description,
                    ImgUrl = ea.Event.ImgUrl,
                    Timefrom = ea.Event.Timefrom,
                    Timeto = ea.Event.Timeto
                },
                Status = ea.Status,
                UserId = (Guid)ea.UserId
            });

            if (currentEventAttendances == null)
            {
                return NotFound();
            }

            return Ok(currentEventAttendances);
        }

        // PUT: api/event-attendances/accept/5
        [HttpPut("accept/{eventId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> AcceptEventAttendance(Guid eventId)
        {
            var userId = GetUserIdFromToken();

            var eventAttendance = await _context.EventAttendances.FirstOrDefaultAsync(x => x.EventId == eventId && x.UserId == userId);

            if (eventAttendance == null)
            {
                return NotFound();
            }

            eventAttendance.Status = "accepted";

            _context.Entry(eventAttendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventAttendanceExists(eventAttendance.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // PUT: api/event-attendances/reject/5
        [HttpPut("reject/{eventId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> RejectEventAttendance(Guid eventId)
        {
            var userId = GetUserIdFromToken();

            var eventAttendance = await _context.EventAttendances.FirstOrDefaultAsync(x => x.EventId == eventId && x.UserId == userId);

            if (eventAttendance == null)
            {
                return NotFound();
            }

            eventAttendance.Status = "rejected";

            _context.Entry(eventAttendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventAttendanceExists(eventAttendance.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        private bool EventAttendanceExists(Guid id)
        {
            return _context.EventAttendances.Any(e => e.Id == id);
        }
    }
}
