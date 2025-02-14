using CsaposApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CsaposApi.Services
{
    public interface IFriendshipService
    {
        Task<bool> SendFriendRequest(Guid senderId, Guid receiverId);
        Task<bool> AcceptFriendRequest(Guid friendshipId, Guid receiverId);
        Task<bool> RejectFriendRequest(Guid friendshipId, Guid receiverId);
        Task<bool> RemoveFriend(Guid userId, Guid friendId);
        Task<bool> BlockUser(Guid userId, Guid blockedUserId);
        Task<List<Guid>> GetFriends(Guid userId);
        Task<List<Friendship>> GetPendingRequests(Guid userId);
    }
}
