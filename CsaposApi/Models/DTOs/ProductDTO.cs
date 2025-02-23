namespace CsaposApi.Models.DTOs
{
    public class ProductDTO
    {
        public class CreateProductDTO
        {
            public string Name { get; set; }
            public string Category { get; set; }
            public int Price { get; set; }
            public int StockQuantity { get; set; }
            public Guid LocationId { get; set; }
        }
    }
}
