using CsaposApi.Services;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace CsaposApi.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly IAuthService _authService;
        private readonly IConnectionManager _connectionManager;

        public NotificationHub(IAuthService authService, IConnectionManager connectionManager)
        {
            _authService = authService;
            _connectionManager = connectionManager;
        }

        public async Task RegisterUser(string token)
        {
            var userId = Guid.Parse(_authService.GetUserId(token));

            _connectionManager.AddConnection(userId, Context.ConnectionId);
        }

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
