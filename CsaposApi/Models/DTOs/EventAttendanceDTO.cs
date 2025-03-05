using static CsaposApi.Models.DTOs.EventDTO;

namespace CsaposApi.Models.DTOs
{
    public class EventAttendanceDTO
    {
        public class EventAttendanceResponseDTO
        {
            public Guid Id { get; set; }
            public EventResponseDTO Event { get; set; }
            public Guid UserId { get; set; }
            public string Status { get; set; }
        }

        public class EventAttendanceRequestDTO
        {
            public Guid EventId { get; set; }
            public bool Status { get; set; }
        }
    }
}
