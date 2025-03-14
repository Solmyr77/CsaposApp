using CsaposApi.Hubs;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using static CsaposApi.Models.DTOs.BookingDTO;
using static CsaposApi.Models.DTOs.FriendshipDTO;

namespace CsaposApi.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IConnectionManager _connectionManager;

        public NotificationService(IHubContext<NotificationHub> hubContext, IConnectionManager connectionManager)
        {
            _hubContext = hubContext;
            _connectionManager = connectionManager;
        }

        public async Task NotifyFriendRequestReceived(string userId, FriendshipResponseDTO friendshipResponse)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyIncomingFriendRequest", friendshipResponse);
        }

        public async Task NotifyFriendRequestAccepted(string userId, FriendshipResponseDTO friendshipResponse)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyFriendRequestAccepted", friendshipResponse);
        }

        public async Task NotifyUserAddedToTable(string userId, BookingResponseWithGuestsDTO currentBooking)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyAddedToTable", currentBooking);
        }
    }
}
