namespace CsaposApi.Models.DTOs
{
    public class TableGuestDTO
    {
        public class TableGuestResponseDTO
        {
            public Guid Id { get; set; }
            public Guid? UserId { get; set; }
            public Guid? BookingId { get; set; }
            public string Status { get; set; }
        }
    }
}
