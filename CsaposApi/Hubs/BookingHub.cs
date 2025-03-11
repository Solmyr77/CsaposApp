using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace CsaposApi.Hubs
{
    public class BookingHub : Hub
    {
        public async Task JoinBookingGroup(string bookingId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, bookingId);
        }

        public async Task LeaveBookingGroup(string bookingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, bookingId);
        }
    }
}
