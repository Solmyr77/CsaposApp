namespace CsaposApi.Models.DTOs
{
    public class LocationDTO
    {
        public class CreateLocationDTO
        {
            public string name { get; set; }
            public string description { get; set; }
            public int capacity { get; set; }
            public int numberOfTables { get; set; }
        }
    }
}
