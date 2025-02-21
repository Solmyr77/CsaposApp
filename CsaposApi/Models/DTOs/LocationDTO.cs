namespace CsaposApi.Models.DTOs
{
    public class LocationDTO
    {
        public class CreateLocationDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string Address { get; set; }
            public int Capacity { get; set; }
            public int NumberOfTables { get; set; }
        }

        public class LocationResponseDTO
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Address { get; set; }
            public int Capacity { get; set; }
            public int NumberOfTables { get; set; }
            public sbyte? Rating { get; set; }
            public bool IsHighlighted { get; set; }
            public bool IsOpen { get; set; }
            public string ImgUrl { get; set; }
        }
    }
}
