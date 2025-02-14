namespace CsaposApi.Models.DTOs
{
    public class BookingDTO
    {
        public class BookingResponseDTO
        {
            public Guid Id { get; set; }
            public Guid? BookerId { get; set; }
            public Guid? TableId { get; set; }
            public DateTime? BookedFrom { get; set; }
            public DateTime? BookedTo { get; set; }
        }

        public class CreateBookingDTO
        {
            public Guid TableId { get; set; }
            public DateTime BookedFrom { get; set; }
            public DateTime BookedTo { get; set; }
        }

        public class AddToTableDTO
        {
            public Guid userId { get; set; }
            public Guid bookingId { get; set; }
        }

        public class RemoveFromTableDTO
        {
            public Guid BookingId { get; set; }
            public Guid UserId { get; set; }
        }
    }
}
