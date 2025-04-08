using Microsoft.VisualStudio.TestTools.UnitTesting;
using CsaposApi.Services;
using CsaposApi.Services.IService;
using CsaposApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace CsaposApi.Tests
{
    [TestClass]
    public class AuthServiceTests
    {
        private CsaposappContext _dbContext;
        private JwtSettings _jwtSettings;
        private IAuthService _authService;
        private User _testUser;

        [TestInitialize]
        public void Setup()
        {
            // 1. In-memory DB
            var options = new DbContextOptionsBuilder<CsaposappContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new CsaposappContext(options);

            // 2. Seed a test user
            _testUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "testuser",
                PasswordHash = "hashedpassword",
                Salt = "somesalt",
                Email = "test@example.com",
                Role = "guest",
                DisplayName = "Test Display",
                LegalName = "Test Legal Name"
            };
            _dbContext.Users.Add(_testUser);
            _dbContext.SaveChanges();

            // 3. Fake JWT settings
            _jwtSettings = new JwtSettings
            {
                SecretKey = "thisIsASecretKeyForTestingPurposes12345", // must be >= 32 chars for HmacSha256
                Issuer = "testIssuer",
                Audience = "testAudience",
                AccessTokenExpiryMinutes = 15,
                RefreshTokenExpiryDays = 7
            };

            // 4. AuthService with real logic
            var optionsWrapper = Options.Create(_jwtSettings);
            _authService = new AuthService(_dbContext, optionsWrapper);
        }

        [TestMethod]
        public async Task GenerateTokenPairAsync_ValidUser_ReturnsTokensAndSavesRefreshToken()
        {
            // Act
            var tokenResponse = await _authService.GenerateTokenPairAsync(_testUser.Id);

            // Assert
            Assert.IsNotNull(tokenResponse);
            Assert.IsFalse(string.IsNullOrWhiteSpace(tokenResponse.AccessToken));
            Assert.IsFalse(string.IsNullOrWhiteSpace(tokenResponse.RefreshToken));

            // Instead of FindAsync, match on the .Token property
            var saved = await _dbContext.RefreshTokens
                .SingleOrDefaultAsync(r => r.Token == tokenResponse.RefreshToken);

            Assert.IsNotNull(saved);
            Assert.AreEqual(_testUser.Id, saved.UserId);
            Assert.IsFalse(saved.IsRevoked);
        }


        [TestMethod]
        public async Task RefreshAccessTokenAsync_ValidToken_ReturnsNewAccessToken()
        {
            // Arrange
            var tokenPair = await _authService.GenerateTokenPairAsync(_testUser.Id);
            var validRefresh = tokenPair.RefreshToken;

            // Act
            var newAccess = await _authService.RefreshAccessTokenAsync(validRefresh);

            // Assert
            Assert.IsNotNull(newAccess);
            Assert.AreNotEqual(tokenPair.AccessToken, newAccess); // probably different JTI
        }

        [TestMethod]
        [ExpectedException(typeof(SecurityTokenException))]
        public async Task RefreshAccessTokenAsync_InvalidToken_ThrowsSecurityTokenException()
        {
            // Act
            await _authService.RefreshAccessTokenAsync("someRandomGarbage");
            // Assert handled by ExpectedException
        }

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_ValidToken_IsRevoked()
        {
            // Arrange
            var tokenPair = await _authService.GenerateTokenPairAsync(_testUser.Id);

            // Act
            await _authService.RevokeRefreshTokenAsync(tokenPair.RefreshToken);

            // Assert
            var saved = await _dbContext.RefreshTokens
                .SingleOrDefaultAsync(r => r.Token == tokenPair.RefreshToken);
            Assert.IsTrue(saved.IsRevoked);
        }

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_TokenNotFound_NoException()
        {
            // Act
            await _authService.RevokeRefreshTokenAsync("doesNotExist");
            // No exception means pass
        }

        [TestMethod]
        public async Task GenerateAccessToken_FindsAndGenerates()
        {
            // Act
            var tokenPair = await _authService.GenerateTokenPairAsync(_testUser.Id);

            // Ensure the "AccessToken" isn't null
            Assert.IsFalse(string.IsNullOrEmpty(tokenPair.AccessToken));
        }

        [TestMethod]
        public void GetUserId_ReturnsCorrectUserId()
        {
            // Arrange
            var tokenPair = _authService.GenerateTokenPairAsync(_testUser.Id).Result;
            var accessToken = tokenPair.AccessToken;

            // Act
            var userIdStr = _authService.GetUserId(accessToken);

            // Assert
            Assert.AreEqual(_testUser.Id.ToString(), userIdStr);
        }

        [TestMethod]
        public void GetUserRole_ReturnsCorrectRole()
        {
            // Arrange
            var tokenPair = _authService.GenerateTokenPairAsync(_testUser.Id).Result;
            var accessToken = tokenPair.AccessToken;

            // Act
            var role = _authService.GetUserRole(accessToken);

            // Assert
            Assert.AreEqual("guest", role);
        }

        [TestMethod]
        [ExpectedException(typeof(Microsoft.IdentityModel.Tokens.SecurityTokenMalformedException))]
        public void GetUserId_WithMalformedToken_ThrowsException()
        {
            _authService.GetUserId("notAValidJWT");
        }
    }
}
