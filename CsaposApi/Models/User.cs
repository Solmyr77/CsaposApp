using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CsaposApi.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = null!;

    [JsonIgnore]
    public string PasswordHash { get; set; } = null!;

    [JsonIgnore]
    public string Salt { get; set; } = null!;

    public string LegalName { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string? ImgUrl { get; set; }
    [JsonIgnore]
    public virtual ICollection<EventAttendance> EventAttendances { get; set; } = new List<EventAttendance>();
    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    [JsonIgnore]
    public virtual ICollection<TableGuest> TableGuests { get; set; } = new List<TableGuest>();
    [JsonIgnore]
    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}
