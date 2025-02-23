using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using CsaposApi.Models.DTOs;
using static CsaposApi.Models.DTOs.BusinessHoursDTO;

namespace CsaposApi.Controllers
{
    [Route("api/business-hours")]
    [ApiController]
    public class BusinessHoursController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public BusinessHoursController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/BusinessHours
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<BusinessHoursResponseDTO>>> GetBusinessHours()
        {
            var businessHours = await _context.BusinessHours
                .Select(bh => new BusinessHoursResponseDTO
                {
                    Id = bh.Id,
                    MondayOpen = bh.MondayOpen,
                    MondayClose = bh.MondayClose,
                    TuesdayOpen = bh.TuesdayOpen,
                    TuesdayClose = bh.TuesdayClose,
                    WednesdayOpen = bh.WednesdayOpen,
                    WednesdayClose = bh.WednesdayClose,
                    ThursdayOpen = bh.ThursdayOpen,
                    ThursdayClose = bh.ThursdayClose,
                    FridayOpen = bh.FridayOpen,
                    FridayClose = bh.FridayClose,
                    SaturdayOpen = bh.SaturdayOpen,
                    SaturdayClose = bh.SaturdayClose,
                    SundayOpen = bh.SundayOpen,
                    SundayClose = bh.SundayClose,
                    LocationId = bh.LocationId,
                    Name = bh.Name,
                })
                .ToListAsync();

            return Ok(businessHours);
        }


        // GET: api/BusinessHours/5
        [HttpGet("{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<BusinessHour>> GetBusinessHour(Guid locationId)
        {
            var businessHour = await _context.BusinessHours.FirstOrDefaultAsync(x => x.LocationId == locationId);

            if (businessHour == null)
            {
                return NotFound();
            }

            var response = new BusinessHoursResponseDTO
            {
                Id = businessHour.Id,
                MondayOpen = businessHour.MondayOpen,
                MondayClose = businessHour.MondayClose,
                TuesdayOpen = businessHour.TuesdayOpen,
                TuesdayClose = businessHour.TuesdayClose,
                WednesdayOpen = businessHour.WednesdayOpen,
                WednesdayClose = businessHour.WednesdayClose,
                ThursdayOpen = businessHour.ThursdayOpen,
                ThursdayClose = businessHour.ThursdayClose,
                FridayOpen = businessHour.FridayOpen,
                FridayClose = businessHour.FridayClose,
                SaturdayOpen = businessHour.SaturdayOpen,
                SaturdayClose = businessHour.SaturdayClose,
                SundayOpen = businessHour.SundayOpen,
                SundayClose = businessHour.SundayClose,
                LocationId = businessHour.LocationId,
                Name = businessHour.Name,
            };

            return Ok(response);
        }

        private bool BusinessHourExists(Guid id)
        {
            return _context.BusinessHours.Any(e => e.Id == id);
        }
    }
}
