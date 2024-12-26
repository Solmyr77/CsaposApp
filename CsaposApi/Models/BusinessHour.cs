using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class BusinessHour
{
    public Guid Id { get; set; }

    public TimeSpan Monday { get; set; }

    public TimeSpan Tuesday { get; set; }

    public TimeSpan Wednesday { get; set; }

    public TimeSpan Thursday { get; set; }

    public TimeSpan Friday { get; set; }

    public TimeSpan Saturday { get; set; }

    public TimeSpan Sunday { get; set; }

    public Guid LocationId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;
}
