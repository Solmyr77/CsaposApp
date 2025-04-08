using Microsoft.VisualStudio.TestTools.UnitTesting;
using CsaposApi.Controllers;
using CsaposApi.Models;
using CsaposApi.Models.DTOs;
using CsaposApi.Services.IService;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CsaposApi.Tests
{
    [TestClass]
    public class AuthControllerTests
    {
        private CsaposappContext _dbContext;
        private Mock<IAuthService> _authServiceMock;
        private Mock<IPasswordService> _passwordServiceMock;
        private AuthController _controller;
        private User _testUser;

        [TestInitialize]
        public void Setup()
        {
            // 1) In-memory EF Core setup
            var options = new DbContextOptionsBuilder<CsaposappContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new CsaposappContext(options);

            // 2) Mock services
            _authServiceMock = new Mock<IAuthService>();
            _passwordServiceMock = new Mock<IPasswordService>();

            // 3) Seed a test user
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

            // 4) AuthController with mocks
            _controller = new AuthController(_dbContext, _authServiceMock.Object, _passwordServiceMock.Object);
        }

        [TestMethod]
        public async Task Login_WithValidCredentials_ReturnsOkWithToken()
        {
            // Arrange
            var loginDto = new UserDTO.LoginUserDTO
            {
                Username = "testuser",
                Password = "validpassword"
            };

            _passwordServiceMock
                .Setup(x => x.HashPassword("validpassword", "somesalt"))
                .Returns("hashedpassword");

            _authServiceMock
                .Setup(x => x.GenerateTokenPairAsync(_testUser.Id))
                .ReturnsAsync(new TokenResponse
                {
                    AccessToken = "access_token",
                    RefreshToken = "refresh_token"
                });

            // Act
            var result = await _controller.Login(loginDto) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);

            var tokenResponse = result.Value as TokenResponse;
            Assert.IsNotNull(tokenResponse);
            Assert.AreEqual("access_token", tokenResponse.AccessToken);
            Assert.AreEqual("refresh_token", tokenResponse.RefreshToken);
        }

        [TestMethod]
        public async Task Login_WithInvalidPassword_ReturnsUnauthorized()
        {
            // Arrange
            var loginDto = new UserDTO.LoginUserDTO
            {
                Username = "testuser",
                Password = "wrongpassword"
            };

            // Mismatch hash
            _passwordServiceMock
                .Setup(x => x.HashPassword("wrongpassword", "somesalt"))
                .Returns("wronghash");

            // Act
            var result = await _controller.Login(loginDto) as UnauthorizedObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(401, result.StatusCode);
            Assert.AreEqual("Invalid username or password.", result.Value);
        }

        [TestMethod]
        public async Task Login_WithUnknownUser_ReturnsUnauthorized()
        {
            // Arrange
            var loginDto = new UserDTO.LoginUserDTO
            {
                Username = "noSuchUser",
                Password = "whatever"
            };

            // Act
            var result = await _controller.Login(loginDto) as UnauthorizedObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(401, result.StatusCode);
        }

        [TestMethod]
        public async Task Register_WithValidData_ReturnsCreatedUser()
        {
            // Arrange
            var registerDto = new UserDTO.RegisterUserDTO
            {
                Username = "newuser",
                Email = "newuser@example.com",
                LegalName = "New User",
                BirthDate = DateTime.UtcNow.AddYears(-20),
                Password = "Valid123"
            };

            _passwordServiceMock
                .Setup(x => x.GenerateSalt())
                .Returns("newSalt");

            _passwordServiceMock
                .Setup(x => x.HashPassword("Valid123", "newSalt"))
                .Returns("newHash");

            // Act
            var result = await _controller.Register(registerDto) as CreatedAtActionResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(201, result.StatusCode);

            // The response is a RegisterResponseDTO
            var responseDto = result.Value as AuthDTO.RegisterResponseDTO;
            Assert.IsNotNull(responseDto);
            Assert.AreEqual("newuser", responseDto.Username);

            // Check the DB user was created
            var dbUser = _dbContext.Users.FirstOrDefault(u => u.Username == "newuser");
            Assert.IsNotNull(dbUser);
            Assert.AreEqual("newHash", dbUser.PasswordHash);
            Assert.AreEqual("newSalt", dbUser.Salt);
        }

        [TestMethod]
        public async Task Register_WithDuplicateUsername_ReturnsConflict()
        {
            // Arrange
            var registerDto = new UserDTO.RegisterUserDTO
            {
                Username = "testuser", // already in DB
                Email = "unique@example.com",
                LegalName = "Legal",
                BirthDate = DateTime.UtcNow.AddYears(-20),
                Password = "Valid123"
            };

            // Act
            var result = await _controller.Register(registerDto) as ObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(409, result.StatusCode); // Conflict
        }

        [TestMethod]
        public async Task Register_WithDuplicateEmail_ReturnsConflict()
        {
            // Arrange
            var registerDto = new UserDTO.RegisterUserDTO
            {
                Username = "uniqueUsername",
                Email = "test@example.com", // same as seeded user
                LegalName = "Legal Name",
                BirthDate = DateTime.UtcNow.AddYears(-20),
                Password = "Valid123"
            };

            // Act
            var result = await _controller.Register(registerDto) as ObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(409, result.StatusCode); // Conflict
        }

        [TestMethod]
        public async Task Register_WithWeakPassword_ReturnsBadRequest()
        {
            // Arrange
            var registerDto = new UserDTO.RegisterUserDTO
            {
                Username = "someNewUser",
                Email = "someNewEmail@example.com",
                LegalName = "Some Name",
                BirthDate = DateTime.UtcNow.AddYears(-20),
                Password = "abc" // too weak
            };

            // Act
            var result = await _controller.Register(registerDto) as BadRequestObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [TestMethod]
        public async Task Logout_WithValidRefreshToken_ReturnsNoContent()
        {
            // Arrange
            var logoutDto = new AuthDTO.LogoutRequestDTO
            {
                RefreshToken = "someToken"
            };

            // No exception means success
            _authServiceMock
                .Setup(x => x.RevokeRefreshTokenAsync("someToken"))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Logout(logoutDto) as NoContentResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(204, result.StatusCode);
        }

        [TestMethod]
        public async Task RefreshAccessToken_WithValidToken_ReturnsNewAccessToken()
        {
            // Arrange
            var refreshDto = new AuthDTO.RefreshTokenRequestDTO
            {
                RefreshToken = "validRefresh"
            };

            _authServiceMock
                .Setup(x => x.RefreshAccessTokenAsync("validRefresh"))
                .ReturnsAsync("newAccessToken");

            // Act
            var result = await _controller.RefreshAccessToken(refreshDto) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);

            // Reflect on the anonymous object for 'accessToken'
            var property = result.Value?.GetType().GetProperty("accessToken");
            var propertyValue = property?.GetValue(result.Value) as string;
            Assert.AreEqual("newAccessToken", propertyValue);
        }


        [TestMethod]
        public async Task RefreshAccessToken_WithInvalidToken_ReturnsUnauthorized()
        {
            // Arrange
            var refreshDto = new AuthDTO.RefreshTokenRequestDTO
            {
                RefreshToken = "invalidRefresh"
            };

            _authServiceMock
                .Setup(x => x.RefreshAccessTokenAsync("invalidRefresh"))
                .Throws(new Microsoft.IdentityModel.Tokens.SecurityTokenException("Invalid or expired refresh token"));

            // Act
            var result = await _controller.RefreshAccessToken(refreshDto) as ObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(401, result.StatusCode);

            // Use reflection to get "error" property
            var errorProp = result.Value?.GetType().GetProperty("error");
            var errorValue = errorProp?.GetValue(result.Value, null) as string;
            Assert.AreEqual("invalid_token", errorValue);

            // Reflection for "message" property
            var messageProp = result.Value?.GetType().GetProperty("message");
            var messageValue = messageProp?.GetValue(result.Value, null) as string;
            Assert.AreEqual("Invalid or expired refresh token", messageValue);
        }


        [TestMethod]
        public async Task UpdatePassword_WithValidData_ReturnsOk()
        {
            // Arrange
            var updateDto = new AuthDTO.PasswordUpdateDTO
            {
                CurrentPassword = "currentPass",
                NewPassword = "NewValid123"
            };

            var token = "mockedAccessToken";
            var userIdString = _testUser.Id.ToString();

            _authServiceMock
                .Setup(x => x.GetUserId(token))
                .Returns(userIdString);

            _passwordServiceMock
                .Setup(x => x.VerifyPassword("currentPass", "hashedpassword", "somesalt"))
                .Returns(true);

            _passwordServiceMock
                .Setup(x => x.GenerateSalt())
                .Returns("newSalt");

            _passwordServiceMock
                .Setup(x => x.HashPassword("NewValid123", "newSalt"))
                .Returns("newHash");

            _controller.ControllerContext.HttpContext = TestUtils.FakeHttpContextWithAuthHeader(token);

            // Act
            var result = await _controller.UpdatePassword(updateDto) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);

            // Reflect the anonymous object => "message"
            var messageProp = result.Value?.GetType().GetProperty("message");
            var messageValue = messageProp?.GetValue(result.Value, null) as string;
            Assert.AreEqual("Password updated successfully.", messageValue);

            // Verify DB was updated
            var updatedUser = _dbContext.Users.Find(_testUser.Id);
            Assert.AreEqual("newHash", updatedUser.PasswordHash);
            Assert.AreEqual("newSalt", updatedUser.Salt);
        }


        [TestMethod]
        public async Task UpdatePassword_WithWrongCurrentPassword_ReturnsUnauthorized()
        {
            // Arrange
            var updateDto = new AuthDTO.PasswordUpdateDTO
            {
                CurrentPassword = "wrongCurrentPass",
                NewPassword = "NewValid123"
            };

            _controller.ControllerContext.HttpContext = TestUtils.FakeHttpContextWithAuthHeader("fakeToken");

            _authServiceMock
                .Setup(x => x.GetUserId("fakeToken"))
                .Returns(_testUser.Id.ToString());

            // Current password mismatch
            _passwordServiceMock
                .Setup(x => x.VerifyPassword("wrongCurrentPass", "hashedpassword", "somesalt"))
                .Returns(false);

            // Act
            var result = await _controller.UpdatePassword(updateDto) as UnauthorizedObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(401, result.StatusCode);
        }
    }
}
