namespace CsaposApi.Models.DTOs
{
    public class FriendshipDTO
    {
        public class FriendshipResponseDTO
        {
            public Guid Id { get; set; }
            public Guid UserId1 { get; set; }
            public Guid UserId2 { get; set; }
            public string Status { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }
    }
}
