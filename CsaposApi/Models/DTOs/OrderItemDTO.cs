namespace CsaposApi.Models.DTOs
{
    public class OrderItemDTO
    {
        public class OrderItemResponseDTO
        {
            public Guid Id { get; set; }
            public Guid OrderId { get; set; }
            public Guid ProductId { get; set; }
            public int UnitPrice { get; set; }
            public int Quantity { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }

        public class OrderItemCreateDTO
        {
            public Guid ProductId { get; set; }
            public int Quantity { get; set; }
        }
    }
}
