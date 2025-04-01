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

        public async Task RegisterUser(string token)
        {
            var userId = Guid.Parse(_authService.GetUserId(token));

            _logger.LogInformation($"Registering user with userId: {userId} and connectionId: {Context.ConnectionId}");

            _connectionManager.AddConnection(userId, Context.ConnectionId);
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
    }
}
