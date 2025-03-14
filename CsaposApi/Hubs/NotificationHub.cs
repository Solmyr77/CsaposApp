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
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(IAuthService authService, IConnectionManager connectionManager)
        {
            _authService = authService;
            _connectionManager = connectionManager;
        }

        public async Task RegisterUser(string token)
        {
            var userId = Guid.Parse(_authService.GetUserId(token));

            _logger.LogInformation($"Registering user with userId: {userId} and connectionId: {Context.ConnectionId}");

            _connectionManager.AddConnection(userId, Context.ConnectionId);
        }

        public async Task JoinBookingGroup()
        {
            _logger.LogInformation($"User with connectionId: {Context.ConnectionId} joined the notifications group");

            await Groups.AddToGroupAsync(Context.ConnectionId, "notifications");
        }

        public async Task LeaveBookingGroup()
        {
            _logger.LogInformation($"User with connectionId: {Context.ConnectionId} left the notifications group");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "notifications");
        }
    }
}
