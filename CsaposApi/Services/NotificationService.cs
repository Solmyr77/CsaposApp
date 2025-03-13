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
        private readonly ConnectionManager _connectionManager;

        public NotificationService(IHubContext<NotificationHub> hubContext, ConnectionManager connectionManager)
        {
            _hubContext = hubContext;
            _connectionManager = connectionManager;
        }

        [HttpPost("invoke")]
        public async Task NotifyUserAddedToTable(string userId, BookingResponseDTO currentBooking)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyAddedToTable", currentBooking);
        }
    }
}
