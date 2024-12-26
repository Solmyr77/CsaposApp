using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class TableGuest
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? TableId { get; set; }

    public virtual Table? Table { get; set; }

    public virtual User? User { get; set; }
}
