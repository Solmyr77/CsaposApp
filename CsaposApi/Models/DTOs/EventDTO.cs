namespace CsaposApi.Models.DTOs
{
    public class EventDTO
    {
        public class EventResponseDTO
        {
            public Guid Id { get; set; }
            public Guid LocationId { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime Timefrom { get; set; }
            public DateTime Timeto { get; set; }
            public string ImgUrl { get; set; }
        }

        public class CreateEventDTO
        {
            public Guid LocationId { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime Timefrom { get; set; }
            public DateTime Timeto { get; set; }
        }

        public class UpdateEventDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime Timefrom { get; set; }
            public DateTime Timeto { get; set; }
            public string ImgUrl { get; set; }
        }
    }
}
