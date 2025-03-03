namespace CsaposApi.Models.DTOs
{
    public class UserDTO
    {
        public class RegisterUserDTO
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string LegalName { get; set; }
            public DateTime BirthDate { get; set; }
        }

        public class LoginUserDTO
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class GetProfileDTO
        {
            public Guid Id { get; set; }
            public string DisplayName { get; set; }
            public string ImageUrl { get; set; }
        }

        public class GetProfileWithBookingStatusDTO
        {
            public Guid Id { get; set; }
            public string DisplayName { get; set; }
            public string ImageUrl { get; set; }
            public string Status { get; set; }
        }

        public class UpdateDisplayNameDTO
        {
            public string DisplayName { get; set; }
        }
    }
}
