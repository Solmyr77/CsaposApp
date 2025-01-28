using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsaposApi.Models;
using static CsaposApi.Models.DTOs.UserDTO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using CsaposApi.Services.IService;
using System.Net;

namespace CsaposApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CsaposappContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(CsaposappContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Users
        [HttpGet]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize(Policy = "MustBeAdmin")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("profile/{id}")]
        [Authorize(Policy = "MustBeGuest")]
        public async Task<ActionResult> GetProfile(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var currentProfile = new GetProfileDTO
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                ImageUrl = user.ImgUrl
            };

            return Ok(currentProfile);
        }

        [HttpGet("profile/search/{displayName}")]
        [Authorize(Policy = "MustBeGuest")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.NoContent)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> GetProfile(string displayName)
        {
            if (string.IsNullOrEmpty(displayName) || displayName.Length < 3)
            {
                return NoContent();
            }

            var users = await _context.Users.Where(x => x.DisplayName.Contains(displayName)).ToListAsync();

            List<GetProfileDTO> usersToReturn = new List<GetProfileDTO>();

            foreach (var user in users)
            {
                usersToReturn.Add(new GetProfileDTO
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    ImageUrl = user.ImgUrl
                });
            }

            return Ok(usersToReturn);
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
