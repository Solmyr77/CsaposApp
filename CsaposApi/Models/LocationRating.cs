using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class LocationRating
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? LocationId { get; set; }

    public int Rating { get; set; }

    public virtual Location? Location { get; set; }

    public virtual User? User { get; set; }
}
