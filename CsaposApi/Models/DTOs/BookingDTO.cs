using static CsaposApi.Models.DTOs.UserDTO;

namespace CsaposApi.Models.DTOs
{
    public class BookingDTO
    {
        public class BookingResponseWithGuestsDTO
        {
            public Guid Id { get; set; }
            public Guid? BookerId { get; set; }
            public Guid? TableId { get; set; }
            public Guid LocationId { get; set; }
            public DateTime? BookedFrom { get; set; }
            public List<GetProfileWithBookingStatusDTO> TableGuests { get; set; } = new List<GetProfileWithBookingStatusDTO>();
        }

        public class BookingResponseDTO
        {
            public Guid Id { get; set; }
            public Guid? BookerId { get; set; }
            public Guid? TableId { get; set; }
            public Guid LocationId { get; set; }
            public DateTime? BookedFrom { get; set; }
        }

        public class CreateBookingDTO
        {
            public Guid TableId { get; set; }
            public DateTime BookedFrom { get; set; }
        }

        public class DeleteBookingDTO
        {
            public Guid BookingId { get; set; }
        }

        public class AddToTableDTO
        {
            public List<Guid> userIds { get; set; } = new List<Guid>();
            public Guid bookingId { get; set; }
        }

        public class RemoveFromTableDTO
        {
            public Guid BookingId { get; set; }
            public Guid UserId { get; set; }
        }
    }
}
