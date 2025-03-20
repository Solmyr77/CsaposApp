using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Table
{
    public Guid Id { get; set; }

    public int Number { get; set; }

    public sbyte Capacity { get; set; }

    public Guid LocationId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Location Location { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<TableBooking> TableBookings { get; set; } = new List<TableBooking>();
}
