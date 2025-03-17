using static CsaposApi.Models.DTOs.OrderItemDTO;

namespace CsaposApi.Models.DTOs
{
    public class OrderDTO
    {
        public class OrderResponseDTO
        {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public Guid TableId { get; set; }
            public Guid LocationId { get; set; }
            public string OrderStatus { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }

            public List<OrderItemResponseDTO> OrderItems { get; set; } = new List<OrderItemResponseDTO>();
        }

        public class OrderCreateDTO
        {
            public Guid TableId { get; set; }
            public Guid BookingId { get; set; }
            public List<OrderItemCreateDTO> OrderItems { get; set; } = new List<OrderItemCreateDTO>();
        }
    }
}
