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
            _logger.LogInformation($"🔄 Attempting to add connection {connectionId} for user {userId}");

            _connections.AddOrUpdate(
                userId,
                _ => new HashSet<string> { connectionId }, // If new user, create a new HashSet
                (_, existingConnections) =>
                {
                    lock (existingConnections) // Ensure thread safety
                    {
                        if (!existingConnections.Contains(connectionId))
                        {
                            existingConnections.Add(connectionId);
                            _logger.LogInformation($"✅ Connection {connectionId} added for user {userId}. Total connections: {existingConnections.Count}");
                        }
                        else
                        {
                            _logger.LogWarning($"⚠️ Connection {connectionId} already exists for user {userId}. Skipping duplicate.");
                        }
                    }
                    return existingConnections;
                });

            _logger.LogInformation($"📌 After adding: User {userId} now has {GetConnections(userId)?.Count ?? 0} connections: {string.Join(", ", GetConnections(userId) ?? new HashSet<string>())}");
        }

        public void RemoveConnection(string connectionId)
        {
            _logger.LogInformation($"🗑 Attempting to remove connection {connectionId}");

            bool found = false;

            foreach (var (userId, connections) in _connections)
            {
                lock (connections)
                {
                    if (connections.Remove(connectionId))
                    {
                        found = true;
                        _logger.LogInformation($"❌ Removed connection {connectionId} for user {userId}. Remaining connections: {connections.Count}");

                        if (connections.Count == 0)
                        {
                            _connections.TryRemove(userId, out _);
                            _logger.LogInformation($"🗑 User {userId} removed from connection manager (no active connections left)");
                        }
                        return;
                    }
                }
            }

            if (!found)
            {
                _logger.LogWarning($"⚠️ Connection {connectionId} was NOT found in any user records! Possible premature disconnection.");
            }
        }


        public HashSet<string>? GetConnections(Guid userId)
        {
            if (_connections.TryGetValue(userId, out var connections))
            {
                if (connections.Count == 0)
                {
                    _logger.LogWarning($"⚠️ User {userId} found, but has NO active connections.");
                    return null;
                }

                _logger.LogInformation($"📢 Found {connections.Count} connections for user {userId}: {string.Join(", ", connections)}");
                return new HashSet<string>(connections);
            }

            _logger.LogWarning($"❌ No active connections found for user {userId}.");
            return null;
        }

        public IEnumerable<Guid> GetConnectedUsers()
        {
            return _connections.Keys;
        }
    }
}
