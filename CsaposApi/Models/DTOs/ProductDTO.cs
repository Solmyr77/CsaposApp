namespace CsaposApi.Models.DTOs
{
    public class ProductDTO
    {
        public class CreateProductDTO
        {
            public string name;
            public string category;
            public int price;
            public int stockQuantity;
            public string imgUrl;
        }
    }
}
