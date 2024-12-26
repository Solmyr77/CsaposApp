using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Event
{
    public Guid Id { get; set; }

    public Guid? LocationId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime Timefrom { get; set; }

    public DateTime Timeto { get; set; }

    public string? ImgUrl { get; set; }

    public virtual ICollection<EventAttendance> EventAttendances { get; set; } = new List<EventAttendance>();

    public virtual Location? Location { get; set; }
}
