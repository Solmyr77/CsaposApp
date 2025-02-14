using CsaposApi.Services;
using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CsaposApi.Services.IService;

namespace CsaposApi.Controllers
{
    [Authorize(Policy = "MustBeGuest")]
    [ApiController]
    [Route("api/friends")]
    public class FriendshipController : ControllerBase
    {
        private readonly IFriendshipService _friendshipService;
        private readonly IAuthService _authService;
        private readonly ILogger<FriendshipController> _logger;

        public FriendshipController(IFriendshipService friendshipService, IAuthService authService, ILogger<FriendshipController> logger)
        {
            _friendshipService = friendshipService;
            _authService = authService;
            _logger = logger;
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

        // Send Friend Request
        [HttpPost("request")]
        public async Task<IActionResult> SendFriendRequest([FromQuery] Guid receiverId)
        {
            try
            {
                Guid senderId = GetUserIdFromToken();
                var success = await _friendshipService.SendFriendRequest(senderId, receiverId);
                return success ? Ok(new { message = "Friend request sent successfully" })
                               : BadRequest(new { error = "Friend request already exists or failed to send" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending friend request");
                return StatusCode(500, new { error = "An error occurred while sending the request" });
            }
        }

        // Accept Friend Request
        [HttpPost("accept/{friendshipId}")]
        public async Task<IActionResult> AcceptFriendRequest(Guid friendshipId)
        {
            try
            {
                Guid receiverId = GetUserIdFromToken();
                var success = await _friendshipService.AcceptFriendRequest(friendshipId, receiverId);
                return success ? Ok(new { message = "Friend request accepted" })
                               : NotFound(new { error = "Friend request not found or already processed" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accepting friend request");
                return StatusCode(500, new { error = "An error occurred while accepting the request" });
            }
        }

        // Reject Friend Request
        [HttpPost("reject/{friendshipId}")]
        public async Task<IActionResult> RejectFriendRequest(Guid friendshipId)
        {
            try
            {
                Guid receiverId = GetUserIdFromToken();
                var success = await _friendshipService.RejectFriendRequest(friendshipId, receiverId);
                return success ? Ok(new { message = "Friend request rejected" })
                               : NotFound(new { error = "Friend request not found or already processed" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting friend request");
                return StatusCode(500, new { error = "An error occurred while rejecting the request" });
            }
        }

        // Remove Friend
        [HttpDelete("remove/{friendId}")]
        public async Task<IActionResult> RemoveFriend(Guid friendId)
        {
            try
            {
                Guid userId = GetUserIdFromToken();
                var success = await _friendshipService.RemoveFriend(userId, friendId);
                return success ? Ok(new { message = "Friend removed successfully" })
                               : NotFound(new { error = "Friendship not found" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing friendship");
                return StatusCode(500, new { error = "An error occurred while removing the friend" });
            }
        }

        // Block User
        [HttpPost("block/{friendId}")]
        public async Task<IActionResult> BlockUser(Guid friendId)
        {
            try
            {
                Guid userId = GetUserIdFromToken();
                var success = await _friendshipService.BlockUser(userId, friendId);
                return success ? Ok(new { message = "User blocked successfully" })
                               : BadRequest(new { error = "Failed to block the user" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error blocking user");
                return StatusCode(500, new { error = "An error occurred while blocking the user" });
            }
        }

        // Get Friends List
        [HttpGet("list")]
        public async Task<IActionResult> GetFriends()
        {
            try
            {
                Guid userId = GetUserIdFromToken();
                var friends = await _friendshipService.GetFriends(userId);
                return Ok(new { friends });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving friends list");
                return StatusCode(500, new { error = "An error occurred while retrieving the friends list" });
            }
        }

        // Get Pending Friend Requests
        [HttpGet("requests")]
        public async Task<IActionResult> GetPendingRequests()
        {
            try
            {
                Guid userId = GetUserIdFromToken();
                var requests = await _friendshipService.GetPendingRequests(userId);
                return Ok(new { pendingRequests = requests });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pending friend requests");
                return StatusCode(500, new { error = "An error occurred while retrieving pending requests" });
            }
        }
    }
}
