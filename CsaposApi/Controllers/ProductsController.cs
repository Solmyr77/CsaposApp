using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using static CsaposApi.Models.DTOs.ProductDTO;
using Microsoft.AspNetCore.Authorization;

namespace CsaposApi.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly CsaposappContext _context;

        public ProductsController(CsaposappContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetProducts()
        {
            return Ok(await _context.Products.Select(pd => new ProductResponseDTO
            {
                Id = pd.Id,
                LocationId = pd.LocationId,
                Name = pd.Name,
                Description = pd.Description,
                Category = pd.Category,
                Price = pd.Price,
                DiscountPercentage = pd.DiscountPercentage,
                StockQuantity = pd.StockQuantity,
                IsActive = pd.IsActive,
                ImgUrl = pd.ImgUrl
            }).ToListAsync());
        }

        [HttpGet("location/{locationId}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetProductsForLocation(Guid locationId)
        {
            return Ok(await _context.Products.Where(x => x.LocationId == locationId).Select(pd => new ProductResponseDTO
            {
                Id = pd.Id,
                LocationId = pd.LocationId,
                Name = pd.Name,
                Description = pd.Description,
                Category = pd.Category,
                Price = pd.Price,
                DiscountPercentage = pd.DiscountPercentage,
                StockQuantity = pd.StockQuantity,
                IsActive = pd.IsActive,
                ImgUrl = pd.ImgUrl
            }).ToListAsync());
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult<ProductResponseDTO>> GetProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var response = new ProductResponseDTO
            {
                Id = product.Id,
                LocationId = product.LocationId,
                Name = product.Name,
                Description = product.Description,
                Category = product.Category,
                Price = product.Price,
                DiscountPercentage = product.DiscountPercentage,
                StockQuantity = product.StockQuantity,
                IsActive = product.IsActive,
                ImgUrl = product.ImgUrl
            };

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "MustBeManager")]
        public async Task<ActionResult<ProductResponseDTO>> CreateProduct(CreateProductDTO createProductDTO)
        {
            Guid productId = Guid.NewGuid();

            var product = new Product
            {
                Id = productId,
                LocationId = createProductDTO.LocationId,
                Name = createProductDTO.Name,
                Description = createProductDTO.Description,
                Category = createProductDTO.Category,
                Price = createProductDTO.Price,
                DiscountPercentage = 0,
                StockQuantity = createProductDTO.StockQuantity,
                IsActive = true,
                ImgUrl = $"{productId}.webp",
            };

            var response = new ProductResponseDTO
            {
                Id = product.Id,
                LocationId = product.LocationId,
                Name = product.Name,
                Description = product.Description,
                Category = product.Category,
                Price = product.Price,
                DiscountPercentage = product.DiscountPercentage,
                StockQuantity = product.StockQuantity,
                IsActive = product.IsActive,
                ImgUrl = product.ImgUrl
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateProduct), response);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "MustBeManager")]
        public async Task<IActionResult> UpdateProduct(Guid id, UpdateProductDTO updateProductDTO)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = updateProductDTO.Name;
            product.Description = updateProductDTO.Description;
            product.Category = updateProductDTO.Category;
            product.Price = updateProductDTO.Price;
            product.DiscountPercentage = updateProductDTO.DiscountPercentage;
            product.StockQuantity = updateProductDTO.StockQuantity;
            product.IsActive = updateProductDTO.IsActive;

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var response = new ProductResponseDTO
            {
                Id = product.Id,
                LocationId = product.LocationId,
                Name = product.Name,
                Description = product.Description,
                Category = product.Category,
                Price = product.Price,
                DiscountPercentage = product.DiscountPercentage,
                StockQuantity = product.StockQuantity,
                IsActive = product.IsActive,
                ImgUrl = product.ImgUrl
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "MustBeManager")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(Guid id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
