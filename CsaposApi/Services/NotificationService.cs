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
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IHubContext<NotificationHub> hubContext, IConnectionManager connectionManager, ILogger<NotificationService> logger)
        {
            _hubContext = hubContext;
            _connectionManager = connectionManager;
            _logger = logger;
        }

        public async Task NotifyFriendRequestReceived(string userId, FriendshipResponseDTO friendshipResponse)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            _logger.LogInformation($"Notifying user with connectionId: {connectionId} about incoming friend request");

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyIncomingFriendRequest", friendshipResponse);
        }

        public async Task NotifyFriendRequestAccepted(string userId, FriendshipResponseDTO friendshipResponse)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            _logger.LogInformation($"Notifying user with connectionId: {connectionId} about friend request accepted");

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyFriendRequestAccepted", friendshipResponse);
        }

        public async Task NotifyUserAddedToTable(string userId, BookingResponseWithGuestsDTO currentBooking)
        {
            var connectionId = _connectionManager.GetConnection(Guid.Parse(userId));

            _logger.LogInformation($"Notifying user with connectionId: {connectionId} about being added to table");

            await _hubContext.Clients.Client(connectionId).SendAsync("NotifyAddedToTable", currentBooking);
        }
    }
}
