using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Payment
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid? OrderId { get; set; }

    public Guid? TableBookingId { get; set; }

    public decimal Amount { get; set; }

    public string PaymentStatus { get; set; } = null!;

    public string? TransactionId { get; set; }

    public DateTime PaymentDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Order? Order { get; set; }

    public virtual TableBooking? TableBooking { get; set; }

    public virtual User User { get; set; } = null!;
}
