using CsaposApi.Hubs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace CsaposApi.Services
{
    public class BookingNotificationService : IBookingNotificationService
    {
        private readonly IHubContext<BookingHub> _hubContext;
        private readonly IConnectionManager _connectionManager;
        private readonly ILogger<BookingNotificationService> _logger;

        public BookingNotificationService(IHubContext<BookingHub> hubContext, IConnectionManager connectionManager, ILogger<BookingNotificationService> logger)
        {
            _hubContext = hubContext;
            _connectionManager = connectionManager;
            _logger = logger;
        }

        public async Task NotifyBookingDeleted(string bookingId)
        {
            _logger.LogInformation($"Notifying group {bookingId} about booking deletion.");
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyBookingDeleted", "Booking deleted.");
        }

        private async Task NotifyUserAsync(string userId, string method, string message)
        {
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

            foreach (var connectionId in connections)
            {
                _logger.LogInformation($"Notifying user {userId} (connectionId: {connectionId}) via {method}");
                await _hubContext.Clients.Client(connectionId).SendAsync(method, message);
            }
        }

        public async Task NotifyUserRemovedFromTable(string bookingId, string userId)
        {
            _logger.LogInformation($"Notifying user {userId} about removal from booking {bookingId}.");
            await NotifyUserAsync(userId, "NotifyUserRemovedFromBooking", $"You were removed from a booking with ID: {bookingId}.");
        }

        public async Task NotifyUserAcceptedInvite(string bookingId, string userId)
        {
            _logger.LogInformation($"User {userId} accepted invite for booking {bookingId}.");
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserAcceptedInvite", $"{userId} accepted the invite.");
        }

        public async Task NotifyUserRejectedInvite(string bookingId, string userId)
        {
            _logger.LogInformation($"User {userId} rejected invite for booking {bookingId}.");
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserRejectedInvite", $"{userId} rejected the invite.");
        }
    }
}
