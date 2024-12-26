namespace CsaposApi.Models.DTOs
{
    public class UserDTO
    {
        public class RegisterUserDTO
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string LegalName { get; set; }
            public DateTime BirthDate { get; set; }
        }

        public class LoginUserDTO
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}
