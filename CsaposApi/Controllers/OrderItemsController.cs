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
    public class OrderItemsController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public OrderItemsController(CsaposappContext context)
        {
            _context = context;
        }

        // GET: api/OrderItems
        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrderItems()
        {
            return Ok(await _context.OrderItems.ToListAsync());
        }

        // GET: api/OrderItems/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<OrderItem>> GetOrderItem(string id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);

            if (orderItem == null)
            {
                return NotFound();
            }

            return Ok(orderItem);
        }

        private bool OrderItemExists(Guid id)
        {
            return _context.OrderItems.Any(e => e.Id == id);
        }
    }
}
