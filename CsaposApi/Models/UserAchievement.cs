using System;
using System.Collections.Generic;

namespace CsaposApi.Models;

public partial class UserAchievement
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid AchievementId { get; set; }

    public DateTime AchievedAt { get; set; }

    public virtual Achievement Achievement { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
