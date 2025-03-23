using static CsaposApi.Models.DTOs.BookingDTO;
using static CsaposApi.Models.DTOs.FriendshipDTO;

namespace CsaposApi.Services.IService
{
    public interface INotificationService
    {
        Task NotifyUserAddedToTable(string userId, BookingResponseWithGuestsDTO currentBooking);
        Task NotifyFriendRequestReceived(string userId, FriendshipResponseDTO friendshipResponse);
        Task NotifyFriendRequestAccepted(string userId, FriendshipResponseDTO friendshipResponse);
        Task NotifyFriendshipRemoved(string userId, Guid friendId);
    }
}
