using System.Threading.Tasks;
using static CsaposApi.Models.DTOs.BookingDTO;

namespace CsaposApi.Services.IService
{
    public interface IBookingNotificationService
    {
        Task NotifyBookingDeleted(string bookingId);
        Task NotifyUserRemovedFromTable(string bookingId, string userId);
        Task NotifyUserAcceptedInvite(string bookingId, string userId);
        Task NotifyUserRejectedInvite(string bookingId, string userId);
    }
}
