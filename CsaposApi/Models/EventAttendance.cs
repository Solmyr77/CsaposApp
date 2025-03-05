using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class EventAttendance
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? EventId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Event? Event { get; set; }

    public virtual User? User { get; set; }
}
