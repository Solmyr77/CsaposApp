namespace CsaposApi.Services.IService
{
    public interface IPasswordService
    {
        string GenerateSalt();

        string HashPassword(string password, string salt);

        /// <summary>
        /// Verifies password.
        /// </summary>
        /// <param name="inputPassword">The password to check.</param>
        /// <param name="storedPasswordHash">The password to check against.</param>
        /// <param name="salt">The stored salt to hash input password with.</param>
        bool VerifyPassword(string inputPassword, string storedPasswordHash, string salt);
    }
}
