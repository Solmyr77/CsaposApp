using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class EventAttendance
{
    public string Id { get; set; } = null!;

    public string? UserId { get; set; }

    public string? EventId { get; set; }

    public virtual Event? Event { get; set; }

    public virtual User? User { get; set; }
}
