using static CsaposApi.Models.DTOs.BookingDTO;

namespace CsaposApi.Services.IService
{
    public interface INotificationService
    {
        Task NotifyUserAddedToTable(string userId, BookingResponseWithGuestsDTO currentBooking);
    }
}
