namespace CsaposApi.Models.DTOs
{
    public class BookingDTO
    {
        public class CreateBookingDTO
        {
            public Guid BookerId { get; set; }
            public Guid TableId { get; set; }
            public DateTime BookedFrom { get; set; }
            public DateTime BookedTo { get; set; }
        }
    }
}
