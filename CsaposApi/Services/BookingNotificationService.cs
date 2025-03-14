using CsaposApi.Hubs;
using CsaposApi.Models;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using static CsaposApi.Models.DTOs.BookingDTO;

namespace CsaposApi.Services
{
    public class BookingNotificationService : IBookingNotificationService
    {
        private readonly IHubContext<BookingHub> _hubContext;

        public BookingNotificationService(IHubContext<BookingHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyBookingDeleted(string bookingId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyBookingDeleted", "Booking deleted.");
        }

        public async Task NotifyUserRemovedFromTable(string bookingId, string userId)
        {
            await _hubContext.Clients.User(userId).SendAsync("NotifyUserRemovedFromBooking", $"You were removed from a booking with ID: {bookingId}.");
        }

        public async Task NotifyUserAcceptedInvite(string bookingId, string userId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserAcceptedInvite", $"{userId} accepted the invite.");
        }

        public async Task NotifyUserRejectedInvite(string bookingId, string userId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("NotifyUserRejectedInvite", $"{userId} rejected the invite.");
        }
    }
}
