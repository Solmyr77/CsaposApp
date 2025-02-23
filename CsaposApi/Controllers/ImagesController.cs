using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
using Microsoft.AspNetCore.Authorization;
using CsaposApi.Models;
using CsaposApi.Services.IService;

namespace CsaposApi.Controllers
{
    [Route("api/images")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IAuthService _authService;

        public ImagesController(CsaposappContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        private const long MaxFileSize = 4 * 1024 * 1024; // 4 MB
        private readonly string _uploadPath = "/var/www/assets/images";

        [HttpPost("upload/profile")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> UploadProfile(IFormFile file)
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();

            var token = "";

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                token = authHeader.Substring("Bearer ".Length).Trim();
            }
            else
            {
                return Unauthorized("Token is malformed.");
            }

            Guid userId = Guid.Parse(_authService.GetUserId(token));

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (file.Length > MaxFileSize)
                return BadRequest("File size exceeds the 4 MB limit.");

            // Ensure the directory exists
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);

            try
            {
                // Load the image into memory
                using var image = Image.Load(file.OpenReadStream());

                // Calculate the crop dimensions for a 1:1 aspect ratio
                int cropSize = Math.Min(image.Width, image.Height); // Smallest dimension for a square
                int cropX = (image.Width - cropSize) / 2;           // Center the crop horizontally
                int cropY = (image.Height - cropSize) / 2;          // Center the crop vertically

                // Crop and resize the image
                image.Mutate(x =>
                {
                    x.Crop(new Rectangle(cropX, cropY, cropSize, cropSize)) // Crop to 1:1 aspect ratio
                     .Resize(new ResizeOptions
                     {
                         Size = new Size(512, 512), // Resize to 512x512
                         Mode = ResizeMode.Crop     // Ensure exact dimensions
                     });
                });

                // Compress and convert to WebP
                var fileName = userId.ToString() + ".webp";
                var filePath = Path.Combine(_uploadPath, fileName);

                await image.SaveAsync(filePath, new WebpEncoder
                {
                    Quality = 75 // Compression level (0-100)
                });

                // Return the saved file's relative URL
                var fileUrl = $"assets/images/{fileName}";
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("upload/location")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<IActionResult> UploadLocation(IFormFile file)
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();

            var token = "";

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                token = authHeader.Substring("Bearer ".Length).Trim();
            }
            else
            {
                return Unauthorized("Token is malformed.");
            }

            Guid userId = Guid.Parse(_authService.GetUserId(token));

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (file.Length > MaxFileSize)
                return BadRequest("File size exceeds the 4 MB limit.");

            // Ensure the directory exists
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);

            try
            {
                // Load the image into memory
                using var image = Image.Load(file.OpenReadStream());

                // Calculate the crop dimensions for a 1:1 aspect ratio
                int cropSize = Math.Min(image.Width, image.Height); // Smallest dimension for a square
                int cropX = (image.Width - cropSize) / 2;           // Center the crop horizontally
                int cropY = (image.Height - cropSize) / 2;          // Center the crop vertically

                // Crop and resize the image
                image.Mutate(x =>
                {
                    x.Crop(new Rectangle(cropX, cropY, cropSize, cropSize)) // Crop to 1:1 aspect ratio
                     .Resize(new ResizeOptions
                     {
                         Size = new Size(512, 512), // Resize to 512x512
                         Mode = ResizeMode.Crop     // Ensure exact dimensions
                     });
                });

                // Compress and convert to WebP
                var fileName = userId.ToString() + ".webp";
                var filePath = Path.Combine(_uploadPath, fileName);

                await image.SaveAsync(filePath, new WebpEncoder
                {
                    Quality = 75 // Compression level (0-100)
                });

                // Return the saved file's relative URL
                var fileUrl = $"assets/images/{fileName}";
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
