using CsaposApi.Services.IService;
using System.Collections.Concurrent;

namespace CsaposApi.Services
{
    public class ConnectionManager : IConnectionManager
    {
        private readonly ConcurrentDictionary<Guid, HashSet<string>> _connections = new();

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

            Console.WriteLine($"Added connection {connectionId} for user {userId}");
        }

        public void RemoveConnection(string connectionId)
        {
            foreach (var (userId, connections) in _connections)
            {
                lock (connections) // Ensure thread safety on modifications
                {
                    if (connections.Remove(connectionId))
                    {
                        Console.WriteLine($"Removed connection {connectionId} for user {userId}");

                        // Clean up if no connections remain
                        if (connections.Count == 0)
                        {
                            _connections.TryRemove(userId, out _);
                            Console.WriteLine($"Removed user {userId} from connection manager (no active connections)");
                        }
                        return;
                    }
                }
            }
        }

        public HashSet<string>? GetConnections(Guid userId)
        {
            return _connections.TryGetValue(userId, out var connections) ? connections : null;
        }

        public IEnumerable<Guid> GetConnectedUsers()
        {
            return _connections.Keys;
        }
    }
}
