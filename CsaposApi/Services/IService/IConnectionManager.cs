namespace CsaposApi.Services.IService
{
    public interface IConnectionManager
    {
        void AddConnection(Guid userId, string connectionId);
        void RemoveConnection(Guid userId);
        string? GetConnection(Guid userId);
    }
}
