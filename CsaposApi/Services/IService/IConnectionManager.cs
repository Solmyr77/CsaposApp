namespace CsaposApi.Services.IService
{
    public interface IConnectionManager
    {
        void AddConnection(Guid userId, string connectionId);
        void RemoveConnection(string connectionId);
        HashSet<string>? GetConnections(Guid userId);
    }
}
