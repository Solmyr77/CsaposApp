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
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyBookingDeleted", new { bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserRemovedFromTable(string bookingId, string userId)
        {
            _logger.LogInformation($"Notifying user {userId} about removal from booking {bookingId}.");
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserRemovedFromBooking", new { removedUserId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserAcceptedInvite(string bookingId, string userId)
        {
            _logger.LogInformation($"User {userId} accepted invite for booking {bookingId}.");
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserAcceptedInvite", new { userId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserRejectedInvite(string bookingId, string userId)
        {
            _logger.LogInformation($"User {userId} rejected invite for booking {bookingId}.");
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserRejectedInvite", new { userId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }
    }
}
