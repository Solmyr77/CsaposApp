namespace CsaposApi.Models.DTOs
{
    public class ProductDTO
    {
        public class CreateProductDTO
        {
            public string name { get; set; }
            public string category { get; set; }
            public int price { get; set; }
            public int stockQuantity { get; set; }
        }
    }
}
