using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Table
{
    public Guid Id { get; set; }

    public int Number { get; set; }

    public sbyte Capacity { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<TableGuest> TableGuests { get; set; } = new List<TableGuest>();
}
