using CsaposApi.Hubs;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        private async Task NotifyUserAsync(string userId, string method, object payload)
        {
            _logger.LogInformation($"NotifService: User Receiving Notification: {userId}");

            if (!Guid.TryParse(userId, out Guid userGuid))
            {
                _logger.LogWarning($"Invalid user ID: {userId}");
                return;
            }

            var connections = _connectionManager.GetConnections(userGuid);
            if (connections == null || connections.Count == 0)
            {
                _logger.LogWarning($"No active connections for user {userId}");
                return;
            }

            payload = new { payload = payload, sentAt = DateTime.Now };

            foreach (var connectionId in connections)
            {
                _logger.LogInformation($"Notifying user {userId} (connectionId: {connectionId}) via {method}");

                await _hubContext.Clients.Client(connectionId).SendAsync(method, payload);
            }
        }

        public async Task NotifyFriendRequestReceived(string userId, FriendshipResponseDTO friendshipResponse)
        {
            await NotifyUserAsync(userId, "NotifyIncomingFriendRequest", friendshipResponse);
        }

        public async Task NotifyFriendRequestAccepted(string userId, FriendshipResponseDTO friendshipResponse)
        {
            await NotifyUserAsync(userId, "NotifyFriendRequestAccepted", friendshipResponse);
        }

        public async Task NotifyUserAddedToTable(string userId, BookingResponseWithGuestsDTO currentBooking)
        {
            await NotifyUserAsync(userId, "NotifyAddedToTable", currentBooking);
        }
    }
}
