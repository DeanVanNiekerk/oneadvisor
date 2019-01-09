using System;
using System.Linq;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
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
    }
}