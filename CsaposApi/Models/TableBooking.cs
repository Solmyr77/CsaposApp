using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class TableBooking
{
    public Guid Id { get; set; }

    public Guid? TableId { get; set; }

    public Guid? BookerId { get; set; }

    public DateTime? BookedFrom { get; set; }

    public DateTime? BookedTo { get; set; }

    public virtual User? Booker { get; set; }

    public virtual Table? Table { get; set; }

    public virtual ICollection<TableGuest> TableGuests { get; set; } = new List<TableGuest>();
}
