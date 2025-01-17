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
            public string AccessToken { get; set; }
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
        }
    }
}