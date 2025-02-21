using System.ComponentModel.DataAnnotations;

namespace CsaposApi.Models.DTOs
{
    public class AuthDTO
    {
        public class RefreshTokenRequestDTO
        {
            [Required]
            public string RefreshToken { get; set; }
        }

        public class LogoutRequestDTO
        {
            [Required]
            public string RefreshToken { get; set; }
        }

        public class PasswordUpdateDTO
        {
            [Required]
            public string CurrentPassword { get; set; }
            [Required]
            public string NewPassword { get; set; }
        }

        public class RegisterResponseDTO
        {
            public Guid Id { get; set; }
            public string Username { get; set; }
            public string LegalName { get; set; }
            public string Email { get; set; }
            public DateTime BirthDate { get; set; }
            public string imgUrl { get; set; }
        }
    }
}