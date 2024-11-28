using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class BusinessHour
{
    public string Id { get; set; } = null!;

    public TimeSpan Monday { get; set; }

    public TimeSpan Tuesday { get; set; }

    public TimeSpan Wednesday { get; set; }

    public TimeSpan Thursday { get; set; }

    public TimeSpan Friday { get; set; }

    public TimeSpan Saturday { get; set; }

    public TimeSpan Sunday { get; set; }

    public string LocationId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;
}
