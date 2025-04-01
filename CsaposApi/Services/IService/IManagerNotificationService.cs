using static CsaposApi.Models.DTOs.OrderDTO;

namespace CsaposApi.Services.IService
{
    public interface IManagerNotificationService
    {
        Task NotifyBookingDeleted(string bookingId, string locationId);
        Task NotifyUserRemovedFromTable(string bookingId, string userId, string locationId);
        Task NotifyUserAddedToTable(string bookingId, string userId, string locationId);
        Task NotifyUserAcceptedInvite(string bookingId, string userId, string locationId);
        Task NotifyUserRejectedInvite(string bookingId, string userId, string locationId);
        Task NotifyOrderCreated(string bookingId, OrderResponseDTO order, string locationId);
    }
}
