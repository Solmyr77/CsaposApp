using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class Achievement
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Criteria { get; set; } = null!;

    public string? IconUrl { get; set; }

    public int? Points { get; set; }

    public string? Type { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}
