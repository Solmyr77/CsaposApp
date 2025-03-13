using CsaposApi.Hubs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using static CsaposApi.Models.DTOs.BookingDTO;

namespace CsaposApi.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("invoke")]
        public async Task NotifyUserAddedToTable(string userId, BookingResponseDTO currentBooking)
        {
            await _hubContext.Clients.Group("notifications").SendAsync("NotifyAddedToTable", currentBooking);
        }
    }
}
