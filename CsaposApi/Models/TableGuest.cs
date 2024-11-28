using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class TableGuest
{
    public string Id { get; set; } = null!;

    public string? UserId { get; set; }

    public string? TableId { get; set; }

    public virtual Table? Table { get; set; }

    public virtual User? User { get; set; }
}
