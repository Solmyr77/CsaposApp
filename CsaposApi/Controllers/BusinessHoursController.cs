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
        public async Task<ActionResult<IEnumerable<BusinessHour>>> GetBusinessHours()
        {
            return Ok(await _context.BusinessHours.ToListAsync());
        }

        // GET: api/BusinessHours/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<BusinessHour>> GetBusinessHour(string id)
        {
            var businessHour = await _context.BusinessHours.FindAsync(id);

            if (businessHour == null)
            {
                return NotFound();
            }

            return Ok(businessHour);
        }

        private bool BusinessHourExists(Guid id)
        {
            return _context.BusinessHours.Any(e => e.Id == id);
        }
    }
}
