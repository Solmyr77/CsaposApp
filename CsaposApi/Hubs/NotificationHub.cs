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

        public NotificationHub(IAuthService authService, IConnectionManager connectionManager, ILogger<NotificationHub> logger)
        {
            _authService = authService;
            _connectionManager = connectionManager;
            _logger = logger;
        }

        public async Task<bool> RegisterUser(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                _logger.LogWarning("Registration failed: Token is empty or null.");
                return false;
            }

            string? userIdString = _authService.GetUserId(token);
            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                _logger.LogWarning($"Registration failed: Invalid token received. Token: {token}");
                return false;
            }

            _logger.LogInformation($"Registering user {userId} with connection {Context.ConnectionId}");

            _connectionManager.AddConnection(userId, Context.ConnectionId);

            await Task.Delay(500);

            return true;
        }

        public async Task JoinNotificationGroup()
        {
            _logger.LogInformation($"User {Context.ConnectionId} joined the notifications group");
            await Groups.AddToGroupAsync(Context.ConnectionId, "notifications");
        }

        public async Task LeaveNotificationGroup()
        {
            _logger.LogInformation($"User {Context.ConnectionId} left the notifications group");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "notifications");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogWarning($"User disconnected. Connection ID: {Context.ConnectionId}, Exception: {exception?.Message}");

            _connectionManager.RemoveConnection(Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
