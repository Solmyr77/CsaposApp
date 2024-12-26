namespace CsaposApi.Models.DTOs
{
    public class LocationDTO
    {
        public class CreateLocationDTO
        {
            public string name { get; set; }
            public int capacity { get; set; }
            public int numberOfTables { get; set; }
            public string imgUrl { get; set; }
        }
    }
}
