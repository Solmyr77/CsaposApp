using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace CsaposApi.Hubs
{
    public class BookingHub : Hub
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ILogger<BookingHub> _logger;
        private readonly IAuthService _authService;
        public BookingHub(IConnectionManager connectionManager, ILogger<BookingHub> logger, IAuthService authService)
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

        public async Task JoinBookingGroup(string bookingId)
        {
            _logger.LogInformation($"User with connectionId: {Context.ConnectionId} joined the booking group");

            await Groups.AddToGroupAsync(Context.ConnectionId, bookingId);
        }

        public async Task LeaveBookingGroup(string bookingId)
        {
            _logger.LogInformation($"User with connectionId: {Context.ConnectionId} left the booking group");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, bookingId);
        }
    }
}
