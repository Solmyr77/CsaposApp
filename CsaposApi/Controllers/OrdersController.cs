using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using static CsaposApi.Models.DTOs.OrderDTO;
using CsaposApi.Services.IService;
using static CsaposApi.Models.DTOs.OrderItemDTO;
using CsaposApi.Models.DTOs;

namespace CsaposApi.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(CsaposappContext context, IAuthService authService, ILogger<OrdersController> logger)
        {
            _context = context;
            _authService = authService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrders()
        {
            return Ok(await _context.Orders.Select(o => new OrderResponseDTO
            {
                Id = o.Id,
                UserId = o.UserId,
                TableId = o.TableId,
                LocationId = o.LocationId,
                OrderStatus = o.OrderStatus,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                // Map order items to their DTOs
                OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    CreatedAt = oi.CreatedAt,
                    UpdatedAt = oi.UpdatedAt
                }).ToList()
            }).ToListAsync());
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<OrderResponseDTO>> GetOrder(Guid id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var response = new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                TableId = order.TableId,
                LocationId = order.LocationId,
                OrderStatus = order.OrderStatus,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                // Map order items to their DTOs
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    CreatedAt = oi.CreatedAt,
                    UpdatedAt = oi.UpdatedAt
                }).ToList()
            };

            return Ok(response);
        }

        [HttpGet("location/{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrdersByLocation(Guid locationId)
        {
            return Ok(await _context.Orders.Where(x => x.LocationId == locationId).Select(o => new OrderResponseDTO
            {
                Id = o.Id,
                UserId = o.UserId,
                TableId = o.TableId,
                LocationId = o.LocationId,
                OrderStatus = o.OrderStatus,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                // Map order items to their DTOs
                OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    CreatedAt = oi.CreatedAt,
                    UpdatedAt = oi.UpdatedAt
                }).ToList()
            }).ToListAsync());
        }

        [HttpGet("orders-by-user")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrdersForUser()
        {
            Guid userId = GetUserIdFromToken();

            var orders = await _context.Orders
                .Where(x => x.UserId == userId)
                .Include(o => o.OrderItems) // eager load order items
                .Select(o => new OrderResponseDTO
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    TableId = o.TableId,
                    LocationId = o.LocationId,
                    OrderStatus = o.OrderStatus,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                    // Map order items to their DTOs
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        Id = oi.Id,
                        OrderId = oi.OrderId,
                        ProductId = oi.ProductId,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity,
                        CreatedAt = oi.CreatedAt,
                        UpdatedAt = oi.UpdatedAt
                    }).ToList()
                }).ToListAsync();

            return Ok(orders);
        }

        [HttpGet("orders-by-table/{tableId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrdersForTable(Guid tableId)
        {
            Guid userId = GetUserIdFromToken();

            var orders = await _context.Orders
                .Where(x => x.TableId == tableId)
                .Include(o => o.OrderItems)
                .Select(o => new OrderResponseDTO
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    TableId = o.TableId,
                    LocationId = o.LocationId,
                    OrderStatus = o.OrderStatus,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                    // Map order items to their DTOs
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        Id = oi.Id,
                        OrderId = oi.OrderId,
                        ProductId = oi.ProductId,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity,
                        CreatedAt = oi.CreatedAt,
                        UpdatedAt = oi.UpdatedAt
                    }).ToList()
                }).ToListAsync();

            return Ok(orders);
        }

        [HttpPost("create-order")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<OrderResponseDTO>> CreateOrder(OrderCreateDTO orderCreateDto)
        {
            Guid userId = GetUserIdFromToken();

            // Retrieve the table to derive its associated location.
            var table = await _context.Tables.FindAsync(orderCreateDto.TableId);
            if (table == null)
            {
                return BadRequest("Invalid table id.");
            }

            // Use the table's LocationId for the order.
            Guid locationId = table.LocationId;

            // Create a new order entity using the table's location.
            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TableId = orderCreateDto.TableId,
                LocationId = locationId,
                OrderStatus = "pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Extract distinct product IDs from the incoming DTO.
            var productIds = orderCreateDto.OrderItems.Select(x => x.ProductId).Distinct().ToList();

            // Load only the products that belong to the derived location.
            var productsDict = await _context.Products
                .Where(p => productIds.Contains(p.Id) && p.LocationId == locationId)
                .ToDictionaryAsync(p => p.Id);

            // Map each order item, ensuring its product is valid and linked to the current location.
            foreach (var itemDto in orderCreateDto.OrderItems)
            {
                if (!productsDict.TryGetValue(itemDto.ProductId, out var product))
                {
                    return BadRequest($"Product with ID {itemDto.ProductId} not found or does not belong to the location.");
                }

                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = product.Id,
                    UnitPrice = product.Price, // Get unit price directly from the product.
                    Quantity = itemDto.Quantity,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                order.OrderItems.Add(orderItem);
            }

            // Add the order (and its order items) to the context and save.
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Map the order to a response DTO.
            var responseDto = new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                TableId = order.TableId,
                LocationId = order.LocationId,
                OrderStatus = order.OrderStatus,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    CreatedAt = oi.CreatedAt,
                    UpdatedAt = oi.UpdatedAt
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, responseDto);
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

        private bool OrderExists(Guid id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
