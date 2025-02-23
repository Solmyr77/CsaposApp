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
    [Route("api/locations")]
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
        public async Task<ActionResult<IEnumerable<LocationResponseDTO>>> GetLocations()
        {
            var locations = await _context.Locations.ToListAsync();

            var response = locations.Select(location => new LocationResponseDTO
            {
                Id = location.Id,
                Name = location.Name,
                Description = location.Description,
                Address = location.Address,
                Capacity = location.Capacity,
                NumberOfTables = location.NumberOfTables,
                Rating = location.Rating,
                IsOpen = location.IsOpen,
                IsHighlighted = location.IsHighlighted,
                ImgUrl = location.ImgUrl
            }).ToList();

            return Ok(response);
        }


        // GET: api/Locations/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<Location>> GetLocation(Guid id)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {
                return NotFound();
            }

            var response = new LocationResponseDTO
            {
                Id = location.Id,
                Name = location.Name,
                Description = location.Description,
                Address = location.Address,
                Capacity = location.Capacity,
                NumberOfTables = location.NumberOfTables,
                Rating = location.Rating,
                IsOpen = location.IsOpen,
                IsHighlighted = location.IsHighlighted,
                ImgUrl = location.ImgUrl
            };

            return Ok(response);
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
                    Name = createLocationDTO.Name,
                    Description = createLocationDTO.Description,
                    Address = createLocationDTO.Address,
                    Capacity = createLocationDTO.Capacity,
                    NumberOfTables = createLocationDTO.NumberOfTables,
                    Rating = -1,
                    IsHighlighted = false,
                    IsOpen = true,
                    CreatedAt = DateTime.Now,
                    ImgUrl = $"{locationId}.webp"
                };

                await _context.Locations.AddAsync(currentLocation);
                await _context.SaveChangesAsync();

                var response = new LocationResponseDTO
                {
                    Id = currentLocation.Id,
                    Name = currentLocation.Name,
                    Description = currentLocation.Description,
                    Address = currentLocation.Address,
                    Capacity = currentLocation.Capacity,
                    NumberOfTables = currentLocation.NumberOfTables,
                    Rating = currentLocation.Rating,
                    IsOpen = currentLocation.IsOpen,
                    IsHighlighted = currentLocation.IsHighlighted,
                    ImgUrl = currentLocation.ImgUrl
                };

                return CreatedAtAction(nameof(CreateLocation), response);
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
