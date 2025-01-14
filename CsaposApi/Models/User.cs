using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string LegalName { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string? ImgUrl { get; set; }

    public virtual ICollection<EventAttendance> EventAttendances { get; set; } = new List<EventAttendance>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<TableGuest> TableGuests { get; set; } = new List<TableGuest>();

    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}
