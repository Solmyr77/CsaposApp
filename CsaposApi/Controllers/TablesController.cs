using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using static CsaposApi.Models.DTOs.TableDTO;
using Microsoft.AspNetCore.Authorization;
using static CsaposApi.Models.DTOs.LocationDTO;
using System.Net;
using static CsaposApi.Models.DTOs.UserDTO;

namespace CsaposApi.Controllers
{
    [Route("api/tables")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public TablesController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/Tables
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<TableResponseDTO>>> GetTables()
        {
            return Ok(await _context.Tables
                .Select(t => new TableResponseDTO
                {
                    Id = t.Id,
                    Number = t.Number,
                    Capacity = t.Capacity,
                    LocationId = t.LocationId
                })
                .ToListAsync());
        }

        // GET: api/Tables/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<TableResponseDTO>> GetTable(Guid id)
        {
            var table = await _context.Tables
                .Where(t => t.Id == id)
                .Select(t => new TableResponseDTO
                {
                    Id = t.Id,
                    Number = t.Number,
                    Capacity = t.Capacity,
                    LocationId = t.LocationId
                })
                .SingleOrDefaultAsync();

            if (table == null)
            {
                return NotFound();
            }

            return Ok(table);
        }

        // GET: api/Tables/5
        [HttpGet("location/{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<TableResponseDTO>> GetTablesByLocation(Guid locationId)
        {
            var table = _context.Tables
                .Where(t => t.LocationId == locationId)
                .Include(t => t.TableBookings)
                    .ThenInclude(b => b.TableGuests)
                .Select(t => new TableResponseDTO
                {
                    Id = t.Id,
                    Number = t.Number,
                    Capacity = t.Capacity,
                    LocationId = t.LocationId
                });
                    IsBooked = t.IsBooked,
                    LocationId = t.LocationId,
                    TableGuests = t.TableBookings
                        .SelectMany(b => b.TableGuests)
                        .Select(g => new GetProfileWithBookingStatusDTO
                        {
                            Id = g.Id,
                            DisplayName = g.User != null ? g.User.DisplayName : "",
                            ImageUrl = g.User != null ? g.User.ImgUrl : "",
                            Status = g.Status
                        })
                        .ToList()
                }).ToList();

            if (table == null)
            {
                return NotFound();
            }

            return Ok(table);
        }

        [HttpPost]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> CreateTable(CreateTableDTO createTableDTO)
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
                var currentTable = new Table
                {
                    Id = Guid.NewGuid(),
                    Number = createTableDTO.number,
                    Capacity = createTableDTO.capacity,
                    LocationId = createTableDTO.locationId
                };

                await _context.Tables.AddAsync(currentTable);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new
                {
                    error = "server_error",
                    // message = "An unexpected error occurred while booking the table.",
                    message = ex.Message
                });
            }
        }

        private bool TableExists(Guid id)
        {
            return _context.Tables.Any(e => e.Id == id);
        }
    }
}
