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
                // (Optional) Handle case where a user tries to befriend themselves
                if (senderId == receiverId)
                {
                    _logger.LogWarning("SenderId and ReceiverId are the same ({Id})", senderId);
                    return false;
                }

                // Look for an existing friendship record, regardless of status.
                var friendship = await _context.Friendships.FirstOrDefaultAsync(f =>
                    (f.UserId1 == senderId && f.UserId2 == receiverId) ||
                    (f.UserId1 == receiverId && f.UserId2 == senderId));

                // If friendship == null, it does not exist; if it's not null, then it does exist.
                if (friendship != null)
                {
                    _logger.LogInformation(
                        "Service: friendship found: ID: {Id}, UID1: {Uid1}, UID2: {Uid2}",
                        friendship.Id, friendship.UserId1, friendship.UserId2);

                    _logger.LogInformation("Service: friendship exists");

                    // If a friendship exists with "pending" or "accepted", no new request is allowed.
                    if (friendship.Status == "pending" || friendship.Status == "accepted")
                    {
                        _logger.LogWarning("Friend request already exists between {SenderId} and {ReceiverId}",
                            senderId, receiverId);
                        return false;
                    }
                    // If the previous request was "rejected" (or any status allowing a new request),
                    // update the existing record rather than creating a new one.
                    else if (friendship.Status == "rejected")
                    {
                        friendship.Status = "pending";
                        friendship.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();

                        _logger.LogInformation(
                            "Service: Notifying user: {ReceiverId}, UID1: {Uid1}, UID2: {Uid2}",
                            receiverId.ToString(), friendship.UserId1, friendship.UserId2);

                        await _notificationService.NotifyFriendRequestReceived(
                            receiverId.ToString(),
                            new FriendshipResponseDTO
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
                    // If none of the above statuses apply, no further action is taken.
                    // Could also handle other statuses here if you want.
                    return false;
                }
                else
                {
                    // Friendship does not exist; create a new one.
                    _logger.LogInformation("Service: friendship does not exist; creating new request.");

                    friendship = new Friendship
                    {
                        Id = Guid.NewGuid(),
                        UserId1 = senderId,
                        UserId2 = receiverId,
                        Status = "pending",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _logger.LogInformation(
                        "Service: Notifying user: {ReceiverId}, UID1: {Uid1}, UID2: {Uid2}",
                        receiverId.ToString(), friendship.UserId1, friendship.UserId2);

                    await _notificationService.NotifyFriendRequestReceived(
                        receiverId.ToString(),
                        new FriendshipResponseDTO
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

                await _notificationService.NotifyFriendshipRemoved(friendId.ToString(), userId);

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
