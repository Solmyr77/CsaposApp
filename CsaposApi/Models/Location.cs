using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Location
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Address { get; set; } = null!;

    public int Capacity { get; set; }

    public int NumberOfTables { get; set; }

    public sbyte? Rating { get; set; }

    public bool IsHighlighted { get; set; }

    public bool IsOpen { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? ImgUrl { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<BusinessHour> BusinessHours { get; set; } = new List<BusinessHour>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<LocationRating> LocationRatings { get; set; } = new List<LocationRating>();

    public virtual ICollection<ManagerMapping> ManagerMappings { get; set; } = new List<ManagerMapping>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}
