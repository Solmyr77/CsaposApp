using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class BusinessHour
{
    public Guid Id { get; set; }

    public TimeSpan MondayOpen { get; set; }

    public TimeSpan TuesdayOpen { get; set; }

    public TimeSpan WednesdayOpen { get; set; }

    public TimeSpan ThursdayOpen { get; set; }

    public TimeSpan FridayOpen { get; set; }

    public TimeSpan SaturdayOpen { get; set; }

    public TimeSpan SundayOpen { get; set; }

    public TimeSpan MondayClose { get; set; }

    public TimeSpan TuesdayClose { get; set; }

    public TimeSpan WednesdayClose { get; set; }

    public TimeSpan ThursdayClose { get; set; }

    public TimeSpan FridayClose { get; set; }

    public TimeSpan SaturdayClose { get; set; }

    public TimeSpan SundayClose { get; set; }

    public Guid LocationId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;
}
