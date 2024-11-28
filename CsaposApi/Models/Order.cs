using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Order
{
    public string Id { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string TableId { get; set; } = null!;

    public string? OrderStatus { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Table Table { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
