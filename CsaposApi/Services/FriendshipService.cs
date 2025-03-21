using CsaposApi.Models;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static CsaposApi.Models.DTOs.FriendshipDTO;

namespace CsaposApi.Services
{
    public class FriendshipService : IFriendshipService
    {
        private readonly CsaposappContext _context;
        private readonly ILogger<FriendshipService> _logger;
        private readonly INotificationService _notificationService;

        public FriendshipService(CsaposappContext context, ILogger<FriendshipService> logger, INotificationService notificationService)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
        }

        public async Task<bool> SendFriendRequest(Guid senderId, Guid receiverId)
        {
            _logger.LogInformation("Service: entered service");
            try
            {
                // Look for an existing friendship record regardless of its status.
                var friendship = await _context.Friendships.FirstOrDefaultAsync(f =>
                    ((f.UserId1 == senderId && f.UserId2 == receiverId) ||
                     (f.UserId1 == receiverId && f.UserId2 == senderId)));

                _logger.LogInformation($"Service: friendship found: ID: {friendship.Id} UID1: {friendship.UserId1} UID2: {friendship.UserId2}");

                if (friendship != null)
                {
                    _logger.LogInformation("Service: friendship exists");
                    // If a friendship exists with a "pending" or "accepted" status, then we don't allow a new request.
                    if (friendship.Status == "pending" || friendship.Status == "accepted")
                    {
                        _logger.LogWarning("Friend request already exists between {SenderId} and {ReceiverId}", senderId, receiverId);
                        return false;
                    }
                    // If the previous request was "rejected" (or any status that allows a new request),
                    // update the existing record rather than creating a new one.
                    else if (friendship.Status == "rejected")
                    {
                        friendship.Status = "pending";
                        friendship.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();

                        await _notificationService.NotifyFriendRequestReceived(receiverId.ToString(), new FriendshipResponseDTO
                        {
                            Id = friendship.Id,
                            UserId1 = friendship.UserId1,
                            UserId2 = friendship.UserId2,
                            Status = friendship.Status,
                            CreatedAt = friendship.CreatedAt,
                            UpdatedAt = friendship.UpdatedAt
                        });

                        return true;
                    }
                }
                else
                {
                    _logger.LogInformation("Service: friendship does not exist");
                    // No existing record found - create a new friend request.
                    friendship = new Friendship
                    {
                        Id = Guid.NewGuid(),
                        UserId1 = senderId,
                        UserId2 = receiverId,
                        Status = "pending",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await _notificationService.NotifyFriendRequestReceived(receiverId.ToString(), new FriendshipResponseDTO
                    {
                        Id = friendship.Id,
                        UserId1 = friendship.UserId1,
                        UserId2 = friendship.UserId2,
                        Status = friendship.Status,
                        CreatedAt = friendship.CreatedAt,
                        UpdatedAt = friendship.UpdatedAt
                    });

                    _context.Friendships.Add(friendship);
                    await _context.SaveChangesAsync();
                    return true;
                }

                _logger.LogCritical("How did we get here?");
                // If no condition is met, return false (shouldn't normally reach here).
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending friend request from {SenderId} to {ReceiverId}", senderId, receiverId);
                return false;
            }
        }


        public async Task<bool> AcceptFriendRequest(Guid friendshipId, Guid receiverId)
        {
            try
            {
                var friendship = await _context.Friendships
                    .FirstOrDefaultAsync(f => f.Id == friendshipId && f.UserId2 == receiverId && f.Status == "pending");

                if (friendship == null)
                {
                    _logger.LogWarning("Friend request {FriendshipId} not found or already processed", friendshipId);
                    return false;
                }

                friendship.Status = "accepted";
                friendship.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                await _notificationService.NotifyFriendRequestAccepted(friendship.UserId1.ToString(), new FriendshipResponseDTO
                {
                    Id = friendshipId,
                    UserId1 = friendship.UserId1,
                    UserId2 = friendship.UserId2,
                    Status = friendship.Status,
                    CreatedAt = friendship.CreatedAt,
                    UpdatedAt = friendship.UpdatedAt
                });

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accepting friend request {FriendshipId}", friendshipId);
                return false;
            }
        }

        public async Task<bool> RejectFriendRequest(Guid friendshipId, Guid receiverId)
        {
            try
            {
                var friendship = await _context.Friendships
                    .FirstOrDefaultAsync(f => f.Id == friendshipId && f.UserId2 == receiverId && f.Status == "pending");

                if (friendship == null)
                {
                    _logger.LogWarning("Friend request {FriendshipId} not found or already processed", friendshipId);
                    return false;
                }

                friendship.Status = "rejected";
                friendship.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting friend request {FriendshipId}", friendshipId);
                return false;
            }
        }

        public async Task<bool> RemoveFriend(Guid userId, Guid friendId)
        {
            try
            {
                var friendship = await _context.Friendships
                    .FirstOrDefaultAsync(f =>
                        (f.UserId1 == userId && f.UserId2 == friendId) ||
                        (f.UserId1 == friendId && f.UserId2 == userId));

                if (friendship == null)
                {
                    _logger.LogWarning("Friendship between {UserId} and {FriendId} not found", userId, friendId);
                    return false;
                }

                _context.Friendships.Remove(friendship);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing friendship between {UserId} and {FriendId}", userId, friendId);
                return false;
            }
        }

        public async Task<bool> BlockUser(Guid userId, Guid blockedUserId)
        {
            try
            {
                var friendship = await _context.Friendships
                    .FirstOrDefaultAsync(f =>
                        (f.UserId1 == userId && f.UserId2 == blockedUserId) ||
                        (f.UserId1 == blockedUserId && f.UserId2 == userId));

                if (friendship != null)
                {
                    friendship.Status = "blocked";
                    friendship.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    friendship = new Friendship
                    {
                        Id = Guid.NewGuid(),
                        UserId1 = userId,
                        UserId2 = blockedUserId,
                        Status = "blocked",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Friendships.Add(friendship);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error blocking user {BlockedUserId} by {UserId}", blockedUserId, userId);
                return false;
            }
        }

        public async Task<List<Guid>> GetFriends(Guid userId)
        {
            try
            {
                return await _context.Friendships
                    .Where(f => (f.UserId1 == userId || f.UserId2 == userId) && f.Status == "accepted")
                    .Select(f => f.UserId1 == userId ? f.UserId2 : f.UserId1)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving friends list for user {UserId}", userId);
                return new List<Guid>();
            }
        }

        public async Task<List<Friendship>> GetPendingRequests(Guid userId)
        {
            try
            {
                return await _context.Friendships
                    .Where(f => f.UserId2 == userId && f.Status == "pending")
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pending friend requests for user {UserId}", userId);
                return new List<Friendship>();
            }
        }
    }
}
