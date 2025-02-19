using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using static CsaposApi.Models.DTOs.LocationDTO;
using Microsoft.AspNetCore.Authorization;
using static CsaposApi.Models.DTOs.BookingDTO;
using System.Net;

namespace CsaposApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public LocationsController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/Locations
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            return Ok(await _context.Locations.ToListAsync());
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<Location>> GetLocation(string id)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {
                return NotFound();
            }

            return Ok(location);
        }

        [HttpPost]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> CreateLocation(CreateLocationDTO createLocationDTO)
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
                var locationId = Guid.NewGuid();

                var currentLocation = new Location
                {
                    Id = locationId,
                    Name = createLocationDTO.name,
                    Description = createLocationDTO.description,
                    Capacity = createLocationDTO.capacity,
                    NumberOfTables = createLocationDTO.numberOfTables,
                    Rating = -1,
                    IsHighlighted = false,
                    IsOpen = true,
                    CreatedAt = DateTime.Now,
                    ImgUrl = $"{locationId}.webp"
                };

                await _context.Locations.AddAsync(currentLocation);
                await _context.SaveChangesAsync();

                return Ok();
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

        private bool LocationExists(Guid id)
        {
            return _context.Locations.Any(e => e.Id == id);
        }
    }
}
