using System.Threading.Tasks;

namespace CsaposApi.Services.IService
{
    public interface IBookingNotificationService
    {
        Task NotifyBookingCreated(string bookingId);
        Task NotifyBookingDeleted(string bookingId);
        Task NotifyUserAddedToTable(string bookingId, string userId);
        Task NotifyUserRemovedFromTable(string bookingId, string userId);
        Task NotifyUserAcceptedInvite(string bookingId, string userId);
        Task NotifyUserRejectedInvite(string bookingId, string userId);
    }
}
