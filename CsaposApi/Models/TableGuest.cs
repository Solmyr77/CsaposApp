using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class TableGuest
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? BookingId { get; set; }

    public virtual TableBooking? Booking { get; set; }

    public virtual User? User { get; set; }
}
