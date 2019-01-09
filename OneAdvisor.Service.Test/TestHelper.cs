using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Test.Models;

namespace OneAdvisor.Service.Test
{
    public class TestHelper
    {
        public static DbContextOptions<DataContext> GetDbContext(string databaseName)
        {
            return new DbContextOptionsBuilder<DataContext>()
               .UseInMemoryDatabase(databaseName)
               .ConfigureWarnings(w => w.Ignore(RelationalEventId.QueryClientEvaluationWarning))
               .Options;
        }

        public static UserEntity InsertDefaultUser(DbContextOptions<DataContext> options)
        {
            return InsertDefaultUserDetailed(options).User;
        }

        public static DefaultUser InsertDefaultUserDetailed(DbContextOptions<DataContext> options)
        {
            var org = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };
            var branch = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org.Id, Name = "Branch 1" };
            var user = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch.Id };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org);
                context.Branch.Add(branch);
                context.User.Add(user);
                context.SaveChanges();
            }

            return new DefaultUser()
            {
                User = user,
                Branch = branch,
                Organisation = org
            };
        }

        public static ScopeOptions GetScopeOptions(DefaultUser user, Scope scope)
        {
            return new ScopeOptions(user.Organisation.Id, user.Branch.Id, user.User.Id, scope);
        }

    }
}
