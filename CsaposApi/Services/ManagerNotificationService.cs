using CsaposApi.Hubs;
using CsaposApi.Models;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using static CsaposApi.Models.DTOs.OrderDTO;

namespace CsaposApi.Services
{
    public class ManagerNotificationService : IManagerNotificationService
    {
        private readonly IHubContext<BookingHub> _hubContext;
        private readonly IConnectionManager _connectionManager;
        private readonly ILogger<ManagerNotificationService> _logger;

        public ManagerNotificationService(IHubContext<BookingHub> hubContext, IConnectionManager connectionManager, ILogger<ManagerNotificationService> logger)
        {
            _hubContext = hubContext;
            _connectionManager = connectionManager;
            _logger = logger;
        }

        public async Task NotifyBookingDeleted(string bookingId, string locationId)
        {
            _logger.LogInformation($"Notifying group {bookingId} about booking deletion.");
            await _hubContext.Clients.Group(locationId).SendAsync("NotifyBookingDeleted", new { bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserRemovedFromTable(string bookingId, string userId, string locationId)
        {
            _logger.LogInformation($"Notifying user {userId} about removal from booking {bookingId}.");
            await _hubContext.Clients.Group(locationId).SendAsync("NotifyUserRemovedFromBooking", new { removedUserId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserAddedToTable(string bookingId, string userId, string locationId)
        {
            _logger.LogInformation($"Notifying user {userId} about adding to booking {bookingId}.");
            await _hubContext.Clients.Group(locationId).SendAsync("NotifyUserAddedToBooking", new { addedUserId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserAcceptedInvite(string bookingId, string userId, string locationId)
        {
            _logger.LogInformation($"User {userId} accepted invite for booking {bookingId}.");
            await _hubContext.Clients.Group(locationId).SendAsync("NotifyUserAcceptedInvite", new { userId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyUserRejectedInvite(string bookingId, string userId, string locationId)
        {
            _logger.LogInformation($"User {userId} rejected invite for booking {bookingId}.");
            await _hubContext.Clients.Group(locationId).SendAsync("NotifyUserRejectedInvite", new { userId = userId, bookingId = bookingId, sentAt = DateTime.Now });
        }

        public async Task NotifyOrderCreated(string bookingId, OrderResponseDTO order, string locationId)
        {
            _logger.LogInformation($"Order has been created for booking {bookingId}.");
            await _hubContext.Clients.Group(locationId).SendAsync("NotifyOrderCreated", new { order = order, bookingId = bookingId, sentAt = DateTime.Now });
        }
    }
}
