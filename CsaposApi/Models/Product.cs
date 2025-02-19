using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Product
{
    public Guid Id { get; set; }

    public Guid LocationId { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public int Price { get; set; }

    public int DiscountPercentage { get; set; }

    public int? StockQuantity { get; set; }

    public bool? IsActive { get; set; }

    public string? ImgUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Location Location { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
