namespace CsaposApi.Services.IService
{
    public interface IPasswordService
    {
        string GenerateSalt();

        string HashPassword(string password, string salt);
    }
}
