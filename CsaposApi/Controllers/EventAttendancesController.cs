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
        public async Task<ActionResult<IEnumerable<EventAttendanceResponseDTO>>> GetEventAttendances()
        {
            var attendances = await _context.EventAttendances
                .Include(x => x.Event)
                .Select(ea => new EventAttendanceResponseDTO
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
                })
                .ToListAsync();

            return Ok(attendances);
        }

        // GET: api/EventAttendances/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<EventAttendanceResponseDTO>> GetEventAttendance(Guid id)
        {
            var currentEventAttendance = await _context.EventAttendances
                .Include(x => x.Event)
                .FirstOrDefaultAsync(x => x.Id == id);

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
        public async Task<ActionResult<IEnumerable<EventAttendanceResponseDTO>>> GetEventAttendanceByLocation(Guid locationId)
        {
            var attendances = _context.EventAttendances
                .Include(x => x.Event)
                .Where(x => x.Event.LocationId == locationId)
                .Select(ea => new EventAttendanceResponseDTO
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
                });

            if (!attendances.Any())
            {
                return NotFound();
            }

            return Ok(await attendances.ToListAsync());
        }

        // PUT: api/event-attendances/accept/5
        [HttpPut("accept/{eventId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> AcceptEventAttendance(Guid eventId)
        {
            var userId = GetUserIdFromToken();

            // Retrieve the event from the database
            var eventFromDb = await _context.Events.FirstOrDefaultAsync(e => e.Id == eventId);
            if (eventFromDb == null)
            {
                return NotFound("Event not found.");
            }

            // Check if an attendance record already exists for this user and event
            var eventAttendance = await _context.EventAttendances
                .Include(ea => ea.Event)
                .FirstOrDefaultAsync(ea => ea.EventId == eventId && ea.UserId == userId);

            if (eventAttendance != null)
            {
                // Update existing record's status
                eventAttendance.Status = "accepted";
            }
            else
            {
                // Create new record if none exists
                eventAttendance = new EventAttendance
                {
                    Id = Guid.NewGuid(),
                    EventId = eventId,
                    UserId = userId,
                    Status = "accepted",
                    Event = eventFromDb
                };
                _context.EventAttendances.Add(eventAttendance);
            }

            await _context.SaveChangesAsync();

            var response = new EventAttendanceResponseDTO
            {
                Id = eventAttendance.Id,
                Event = new EventResponseDTO
                {
                    Id = eventAttendance.Event.Id,
                    LocationId = (Guid)eventAttendance.Event.LocationId,
                    Name = eventAttendance.Event.Name,
                    Description = eventAttendance.Event.Description,
                    ImgUrl = eventAttendance.Event.ImgUrl,
                    Timefrom = eventAttendance.Event.Timefrom,
                    Timeto = eventAttendance.Event.Timeto
                },
                UserId = (Guid)eventAttendance.UserId,
                Status = eventAttendance.Status,
            };

            return CreatedAtAction(nameof(GetEventAttendance), new { id = eventAttendance.Id }, response);
        }

        // PUT: api/event-attendances/reject/5
        [HttpPut("reject/{eventId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> RejectEventAttendance(Guid eventId)
        {
            var userId = GetUserIdFromToken();

            // Retrieve the event from the database
            var eventFromDb = await _context.Events.FirstOrDefaultAsync(e => e.Id == eventId);
            if (eventFromDb == null)
            {
                return NotFound("Event not found.");
            }

            // Check if an attendance record already exists for this user and event
            var eventAttendance = await _context.EventAttendances
                .Include(ea => ea.Event)
                .FirstOrDefaultAsync(ea => ea.EventId == eventId && ea.UserId == userId);

            if (eventAttendance != null)
            {
                // Update existing record's status
                eventAttendance.Status = "rejected";
            }
            else
            {
                // Create new record if none exists
                eventAttendance = new EventAttendance
                {
                    Id = Guid.NewGuid(),
                    EventId = eventId,
                    UserId = userId,
                    Status = "rejected",
                    Event = eventFromDb
                };
                _context.EventAttendances.Add(eventAttendance);
            }

            await _context.SaveChangesAsync();

            var response = new EventAttendanceResponseDTO
            {
                Id = eventAttendance.Id,
                Event = new EventResponseDTO
                {
                    Id = eventAttendance.Event.Id,
                    LocationId = (Guid)eventAttendance.Event.LocationId,
                    Name = eventAttendance.Event.Name,
                    Description = eventAttendance.Event.Description,
                    ImgUrl = eventAttendance.Event.ImgUrl,
                    Timefrom = eventAttendance.Event.Timefrom,
                    Timeto = eventAttendance.Event.Timeto
                },
                UserId = (Guid)eventAttendance.UserId,
                Status = eventAttendance.Status,
            };

            return CreatedAtAction(nameof(GetEventAttendance), new { id = eventAttendance.Id }, response);
        }

        private bool EventAttendanceExists(Guid id)
        {
            return _context.EventAttendances.Any(e => e.Id == id);
        }
    }
}
