using static CsaposApi.Models.DTOs.UserDTO;

namespace CsaposApi.Models.DTOs
{
    public class TableDTO
    {
        public class TableResponseDTO
        {
            public Guid Id { get; set; }
            public int Number { get; set; }
            public sbyte Capacity { get; set; }
            public bool IsBooked { get; set; }
            public Guid LocationId { get; set; }

            public IEnumerable<GetProfileWithBookingStatusDTO> TableGuests { get; set; } = new List<GetProfileWithBookingStatusDTO>();
        }

        public class CreateTableDTO
        {
            public int number { get; set; }
            public sbyte capacity { get; set; }
            public Guid locationId { get; set; }
        }
    }
}
