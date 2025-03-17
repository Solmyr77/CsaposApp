using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Order
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid TableId { get; set; }

    public Guid LocationId { get; set; }

    public Guid BookingId { get; set; }

    public string? OrderStatus { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual TableBooking Booking { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Table Table { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
