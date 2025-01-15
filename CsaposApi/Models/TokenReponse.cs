namespace CsaposApi.Models
{
    public class TokenResponse
    {
        public string AccessToken { get; set; }
        public DateTime AccessTokenExpiry { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
    }
}
