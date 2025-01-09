using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CsaposApi.Models;

public partial class Table
{
    public Guid Id { get; set; }

    public int Number { get; set; }

    public sbyte Capacity { get; set; }

    public bool IsBooked { get; set; }

    public Guid LocationId { get; set; }

    public Guid BookerId { get; set; }

    public DateTime BookedFrom { get; set; }

    public DateTime BookedTo { get; set; }

    public virtual User Booker { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    [JsonIgnore]
    public virtual ICollection<TableGuest> TableGuests { get; set; } = new List<TableGuest>();
}
