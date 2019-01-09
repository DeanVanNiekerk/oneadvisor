using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Common.Query
{
    public class ScopeQuery
    {
        public static IQueryable<UserEntity> GetUserEntityQuery(DataContext context, ScopeOptions options)
        {
            if (options.Scope == Scope.User)
            {
                return from user in context.User
                       where user.Id == options.UserId
                       select user;
            }

            if (options.Scope == Scope.Branch)
            {
                return from user in context.User
                       join branch in context.Branch
                           //on new { Key1 = user.BranchId, Key2 = options.BranchId.Value } equals new { Key1 = branch.Id, Key2 = branch.Id }
                           on user.BranchId equals branch.Id
                       where branch.Id == options.BranchId
                       select user;
            }

            return GetUserEntityQuery(context, options.OrganisationId);
        }

        public static IQueryable<UserEntity> GetUserEntityQuery(DataContext context, Guid organisationId)
        {
            return from user in context.User
                   join branch in context.Branch
                       //on new { Key1 = user.BranchId, Key2 = options.OrganisationId.Value } equals new { Key1 = branch.Id, Key2 = branch.OrganisationId }
                       on user.BranchId equals branch.Id
                   where branch.OrganisationId == organisationId
                   select user;
        }

        public static async Task<bool> IsMemberInScope(DataContext context, ScopeOptions options, Guid memberId)
        {
            var userQuery = GetUserEntityQuery(context, options);

            var query = from user in userQuery
                        join member in context.Member
                            on user.Id equals member.UserId
                        where member.Id == memberId
                        select member;

            return await query.AnyAsync();
        }

        public static async Task<Result> IsMemberInScopeResult(DataContext context, ScopeOptions options, Guid memberId)
        {
            var result = new Result();

            var inScope = await IsMemberInScope(context, options, memberId);

            if (!inScope)
            {
                result.AddValidationFailure("MemberId", "Member exists but is out of scope");
                return result;
            }

            result.Success = true;
            return result;
        }
    }
}