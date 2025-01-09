namespace CsaposApi.Models.DTOs
{
    public class TableDTO
    {
        public class CreateTableDTO
        {
            public int number { get; set; }
            public sbyte capacity { get; set; }
            public Guid locationId { get; set; }
        }
    }
}
