namespace CsaposApi.Models.DTOs
{
    public class ProductDTO
    {
        public class CreateProductDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public int Price { get; set; }
            public int StockQuantity { get; set; }
            public Guid LocationId { get; set; }
        }

        public class UpdateProductDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public int Price { get; set; }
            public int DiscountPercentage { get; set; }
            public int? StockQuantity { get; set; }
            public bool? IsActive { get; set; }
            public string ImgUrl { get; set; }
        }

        public class ProductResponseDTO
        {
            public Guid Id { get; set; }
            public Guid LocationId { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public int Price { get; set; }
            public int DiscountPercentage { get; set; }
            public int? StockQuantity { get; set; }
            public bool? IsActive { get; set; }
            public string ImgUrl { get; set; }
        }
    }
}
