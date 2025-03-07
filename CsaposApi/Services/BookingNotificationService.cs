using CsaposApi.Hubs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CsaposApi.Services
{
    public class BookingNotificationService : IBookingNotificationService
    {
        private readonly IHubContext<BookingHub> _hubContext;

        public BookingNotificationService(IHubContext<BookingHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyBookingCreated(string bookingId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("ReceiveBookingUpdate", "New booking created.");
        }

        public async Task NotifyBookingDeleted(string bookingId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("ReceiveBookingUpdate", "Booking deleted.");
        }

        public async Task NotifyUserAddedToTable(string bookingId, string userId)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveBookingUpdate", "You were added to a booking.");
        }

        public async Task NotifyUserRemovedFromTable(string bookingId, string userId)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveBookingUpdate", "You were removed from a booking.");
        }

        public async Task NotifyUserAcceptedInvite(string bookingId, string userId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("ReceiveBookingUpdate", $"{userId} accepted the invite.");
        }

        public async Task NotifyUserRejectedInvite(string bookingId, string userId)
        {
            await _hubContext.Clients.Group(bookingId).SendAsync("ReceiveBookingUpdate", $"{userId} rejected the invite.");
        }
    }
}
