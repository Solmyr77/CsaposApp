using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Location
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public int Capacity { get; set; }

    public int NumberOfTables { get; set; }

    public sbyte? Rating { get; set; }

    public bool IsHighlighted { get; set; }

    public bool IsOpen { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? ImgUrl { get; set; }

    public virtual ICollection<BusinessHour> BusinessHours { get; set; } = new List<BusinessHour>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
