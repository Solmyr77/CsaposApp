using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class RefreshToken
{
    public Guid Id { get; set; }

    public string Token { get; set; } = null!;

    public DateTime Expiration { get; set; }

    public bool IsRevoked { get; set; }

    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
