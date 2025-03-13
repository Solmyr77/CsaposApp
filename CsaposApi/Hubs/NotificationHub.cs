using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace CsaposApi.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinBookingGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "notifications");
        }

        public async Task LeaveBookingGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "notifications");
        }
    }
}
