using CsaposApi.Hubs;
using CsaposApi.Services.IService;
using Microsoft.AspNetCore.SignalR;

namespace CsaposApi.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }
    }
}
