using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class TableBooking
{
    public Guid Id { get; set; }

    public Guid? TableId { get; set; }

    public Guid? BookerId { get; set; }

    public DateTime? BookedFrom { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User? Booker { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Table? Table { get; set; }

    public virtual ICollection<TableGuest> TableGuests { get; set; } = new List<TableGuest>();
}
