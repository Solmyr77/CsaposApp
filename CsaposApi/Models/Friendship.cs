using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Friendship
{
    public Guid Id { get; set; }

    public Guid UserId1 { get; set; }

    public Guid UserId2 { get; set; }

    public string? Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User UserId1Navigation { get; set; } = null!;

    public virtual User UserId2Navigation { get; set; } = null!;
}
