using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CsaposApi.Models;

public partial class Product
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public int Price { get; set; }

    public int? StockQuantity { get; set; }

    public bool? IsActive { get; set; }

    public string? ImgUrl { get; set; }

    [JsonIgnore]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
