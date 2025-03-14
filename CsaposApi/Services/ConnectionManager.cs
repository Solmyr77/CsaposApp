using CsaposApi.Services.IService;
using System.Collections.Concurrent;

namespace CsaposApi.Services
{
    public class ConnectionManager : IConnectionManager
    {
        private readonly ConcurrentDictionary<Guid, HashSet<string>> _connections = new();
        private readonly ILogger<ConnectionManager> _logger;

        public ConnectionManager(ILogger<ConnectionManager> logger)
        {
            _logger = logger;
        }

        public void AddConnection(Guid userId, string connectionId)
        {
            _connections.AddOrUpdate(
                userId,
                _ => new HashSet<string> { connectionId }, // If new user, create a new HashSet
                (_, existingConnections) =>
                {
                    lock (existingConnections) // Ensure thread safety on modifications
                    {
                        existingConnections.Add(connectionId);
                    }
                    return existingConnections;
                });

            _logger.LogInformation($"Added connection {connectionId} for user {userId}");
        }

        public void RemoveConnection(string connectionId)
        {
            foreach (var (userId, connections) in _connections)
            {
                lock (connections) // Ensure thread safety on modifications
                {
                    if (connections.Remove(connectionId))
                    {
                        _logger.LogInformation($"Removed connection {connectionId} for user {userId}");

                        // Clean up if no connections remain
                        if (connections.Count == 0)
                        {
                            _connections.TryRemove(userId, out _);
                            _logger.LogInformation($"Removed user {userId} from connection manager (no active connections)");
                        }
                        return;
                    }
                }
            }
        }

        public HashSet<string>? GetConnections(Guid userId)
        {
            if (_connections.TryGetValue(userId, out var connections))
            {
                if (connections.Count == 0)
                {
                    _logger.LogWarning($"User {userId} found, but has no active connections.");
                    return null;
                }

                _logger.LogInformation($"Found {connections.Count} connections for user {userId}.");
                return new HashSet<string>(connections); // Return a clone to avoid concurrency issues
            }

            _logger.LogWarning($"No active connections found for user {userId}.");
            return null;
        }


        public IEnumerable<Guid> GetConnectedUsers()
        {
            return _connections.Keys;
        }
    }
}
