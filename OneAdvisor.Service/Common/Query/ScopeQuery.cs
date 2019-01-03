using System.Linq;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Service.Common.Query
{
    public class ScopeQuery
    {
        public static IQueryable<UserEntity> GetUserEntityQuery(DataContext context, ScopeOptions options)
        {
            if (options.OrganisationId.HasValue)
            {
                return from user in context.User
                       join branch in context.Branch
                           //on new { Key1 = user.BranchId, Key2 = options.OrganisationId.Value } equals new { Key1 = branch.Id, Key2 = branch.OrganisationId }
                           on user.BranchId equals branch.Id
                       where branch.OrganisationId == options.OrganisationId.Value
                       select user;
            }

            if (options.BranchId.HasValue)
            {
                return from user in context.User
                       join branch in context.Branch
                           //on new { Key1 = user.BranchId, Key2 = options.BranchId.Value } equals new { Key1 = branch.Id, Key2 = branch.Id }
                           on user.BranchId equals branch.Id
                       where branch.Id == options.BranchId.Value
                       select user;
            }

            if (!string.IsNullOrEmpty(options.UserId))
            {
                return from user in context.User
                       where user.Id == options.UserId
                       select user;
            }

            return from user in context.User
                   select user;
        }
    }
}