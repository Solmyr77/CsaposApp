using System.Collections.Concurrent;

namespace CsaposApi.Services
{
    public class ConnectionManager
    {
        private readonly ConcurrentDictionary<Guid, string> _connections = new();

        public void AddConnection(Guid userId, string connectionId)
        {
            _connections.AddOrUpdate(userId, connectionId, (key, value) => connectionId);
        }

        public void RemoveConnection(Guid userId)
        {
            _connections.TryRemove(userId, out _);
        }

        public string? GetConnection(Guid userId)
        {
            return _connections.TryGetValue(userId, out var connectionId) ? connectionId : null;
        }
    }
}
