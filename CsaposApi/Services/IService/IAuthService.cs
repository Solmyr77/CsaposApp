using CsaposApi.Models;
using static CsaposApi.Models.DTOs.UserDTO;

namespace CsaposApi.Services.IService
{
    public interface IAuthService
    {
        /// <summary>
        /// Generates a new pair of access and refresh tokens for a user.
        /// </summary>
        /// <param name="userId">The unique user identifier.</param>
        /// <returns>A TokenResponse containing access/refresh tokens and expiry data.</returns>
        Task<TokenResponse> GenerateTokenPairAsync(Guid userId);

        /// <summary>
        /// Validates and refreshes an expired or soon-to-be-expired access token using a refresh token.
        /// </summary>
        /// <param name="refreshTokenValue">The refresh token value.</param>
        /// <returns>A new TokenResponse if valid; otherwise null or throw an exception.</returns>
        Task<string> RefreshAccessTokenAsync(string refreshTokenValue);

        /// <summary>
        /// Invalidates a refresh token, preventing further use.
        /// </summary>
        /// <param name="refreshToken">The refresh token to revoke.</param>
        Task RevokeRefreshTokenAsync(string refreshToken);
    }
}
