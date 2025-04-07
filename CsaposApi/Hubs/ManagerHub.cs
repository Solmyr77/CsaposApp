using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace CsaposApi.Hubs
{
    public class ManagerHub : Hub
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ILogger<ManagerHub> _logger;
        private readonly IAuthService _authService;
        public ManagerHub(IConnectionManager connectionManager, ILogger<ManagerHub> logger, IAuthService authService)
        {
            _connectionManager = connectionManager;
            _logger = logger;
            _authService = authService;
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

        public async Task JoinManagerGroup(string locationId)
        {
            _logger.LogInformation($"User with connectionId: {Context.ConnectionId} joined the location group");

            await Groups.AddToGroupAsync(Context.ConnectionId, locationId);
        }

        public async Task LeaveManagerGroup(string locationId)
        {
            _logger.LogInformation($"User with connectionId: {Context.ConnectionId} left the location group");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, locationId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogWarning($"User disconnected. Connection ID: {Context.ConnectionId}, Exception: {exception?.Message}");

            _connectionManager.RemoveConnection(Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
