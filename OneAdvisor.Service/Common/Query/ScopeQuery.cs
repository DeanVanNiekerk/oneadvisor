using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Common.Query
{
    public class ScopeQuery
    {
        public static IQueryable<MemberEntity> GetMemberEntityQuery(DataContext context, ScopeOptions options)
        {
            return from member in context.Member
                   where member.OrganisationId == options.OrganisationId
                   && member.IsDeleted == false
                   select member;
        }

        public static IQueryable<UserEntity> GetUserEntityQuery(DataContext context, ScopeOptions options)
        {
            if (options.IgnoreScope)
            {
                return from user in context.Users
                       select user;
            }

            if (options.Scope == Scope.User)
            {
                return from user in context.Users
                       where user.Id == options.UserId
                       select user;
            }

            if (options.Scope == Scope.Branch)
            {
                return from user in context.Users
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
            return from user in context.Users
                   join branch in context.Branch
                       //on new { Key1 = user.BranchId, Key2 = options.OrganisationId.Value } equals new { Key1 = branch.Id, Key2 = branch.OrganisationId }
                       on user.BranchId equals branch.Id
                   where branch.OrganisationId == organisationId
                   select user;
        }

        public static IQueryable<OrganisationEntity> GetOrganisationEntityQuery(DataContext context, ScopeOptions options)
        {
            if (options.IgnoreScope)
            {
                return from organisation in context.Organisation
                       select organisation;
            }

            return from organisation in context.Organisation
                   where organisation.Id == options.OrganisationId
                   select organisation;
        }

        public static IQueryable<BranchEntity> GetBranchEntityQuery(DataContext context, ScopeOptions options)
        {
            if (options.IgnoreScope)
            {
                return from branch in context.Branch
                       select branch;
            }

            if (options.Scope == Scope.User || options.Scope == Scope.Branch)
            {
                return from branch in context.Branch
                       where branch.Id == options.BranchId
                       select branch;
            }

            return from branch in context.Branch
                   where branch.OrganisationId == options.OrganisationId
                   select branch;
        }

        public static bool IsOrganisationInScope(ScopeOptions options, Guid organisationId)
        {
            if (options.IgnoreScope)
                return true;

            return options.OrganisationId == organisationId;
        }

        public static async Task<Result> IsMemberInOrganisation(DataContext context, ScopeOptions options, Guid memberId)
        {
            var result = new Result();

            var member = await context.Member.FindAsync(memberId);

            if (member == null || member.IsDeleted || member.OrganisationId != options.OrganisationId)
            {
                result.AddValidationFailure("MemberId", "Member does not exist");
                return result;
            }

            result.Success = true;
            return result;
        }

        public static async Task<Result> CheckScope(DataContext context, ScopeOptions scope, Guid memberId, Guid userId)
        {
            var result = await ScopeQuery.IsMemberInOrganisation(context, scope, memberId);

            if (!result.Success)
                return result;

            return await ScopeQuery.IsUserInScopeResult(context, scope, userId);
        }

        public static async Task<bool> IsUserInScope(DataContext context, ScopeOptions options, Guid userId)
        {
            if (options.UserId == userId)
                return true;

            var userQuery = GetUserEntityQuery(context, options);

            var query = from user in userQuery
                        where user.Id == userId
                        select user;

            return await query.AnyAsync();
        }

        public static async Task<Result> IsUserInScopeResult(DataContext context, ScopeOptions options, Guid userId)
        {
            var result = new Result();

            var inScope = await IsUserInScope(context, options, userId);

            if (!inScope)
            {
                result.AddValidationFailure("UserId", "Out of scope");
                return result;
            }

            result.Success = true;
            return result;
        }
    }
}