using Microsoft.VisualStudio.TestTools.UnitTesting;
using CsaposApi.Services;
using CsaposApi.Services.IService;
using System;

namespace CsaposApi.Tests
{
    [TestClass]
    public class PasswordServiceTests
    {
        private IPasswordService _passwordService;

        [TestInitialize]
        public void Setup()
        {
            _passwordService = new PasswordService();
        }

        [TestMethod]
        public void GenerateSalt_ReturnsBase64String()
        {
            // Act
            var salt = _passwordService.GenerateSalt();

            // Assert
            Assert.IsFalse(string.IsNullOrEmpty(salt));

            var saltBytes = Convert.FromBase64String(salt);
            Assert.AreEqual(16, saltBytes.Length);
        }

        [TestMethod]
        public void HashPassword_GeneratesConsistentHash()
        {
            // Arrange
            var password = "myPassword123";
            var salt = "mySalt";

            // Act
            var hash1 = _passwordService.HashPassword(password, salt);
            var hash2 = _passwordService.HashPassword(password, salt);

            // Assert
            Assert.AreEqual(hash1, hash2);
        }

        [TestMethod]
        public void VerifyPassword_ReturnsTrueForCorrectPassword()
        {
            // Arrange
            var password = "test123";
            var salt = "someSalt";
            var storedHash = _passwordService.HashPassword(password, salt);

            // Act
            var result = _passwordService.VerifyPassword("test123", storedHash, salt);

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void VerifyPassword_ReturnsFalseForWrongPassword()
        {
            // Arrange
            var password = "test123";
            var salt = "someSalt";
            var storedHash = _passwordService.HashPassword(password, salt);

            // Act
            var result = _passwordService.VerifyPassword("wrongPass", storedHash, salt);

            // Assert
            Assert.IsFalse(result);
        }
    }
}
