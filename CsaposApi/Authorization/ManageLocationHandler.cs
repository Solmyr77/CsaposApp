using CsaposApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CsaposApi.Authorization
{
    public class ManageLocationHandler
        : AuthorizationHandler<ManageLocationRequirement, Guid>
    {
        private readonly CsaposappContext _context;

        public ManageLocationHandler(CsaposappContext context)
        {
            _context = context;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            ManageLocationRequirement requirement,
            Guid locationId)
        {
            if (!context.User.Identity?.IsAuthenticated ?? false)
            {
                context.Fail();
                return;
            }

            var userIdClaim = context.User.Claims.FirstOrDefault(c => c.Type == "sub");
            if (userIdClaim == null ||
                !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                context.Fail();
                return;
            }

            var isManager = await _context.ManagerMappings
                .AnyAsync(mm => mm.UserId == userId && mm.LocationId == locationId);

            if (isManager)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
        }
    }

}
