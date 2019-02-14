using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;
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

        public static OrganisationEntity InsertDefaultOrganisation(DbContextOptions<DataContext> options)
        {
            var organisation = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(organisation);
                context.SaveChanges();
            }

            return organisation;
        }

        public static DefaultUser InsertDefaultUserDetailed(DbContextOptions<DataContext> options)
        {
            var organisation = InsertDefaultOrganisation(options);

            return InsertDefaultUserDetailed(options, organisation);
        }

        public static DefaultUser InsertDefaultUserDetailed(DbContextOptions<DataContext> options, OrganisationEntity organisation)
        {
            var user = new UserEdit { Id = Guid.NewGuid().ToString(), FirstName = Guid.NewGuid().ToString(), LastName = Guid.NewGuid().ToString() };

            return InsertDefaultUserDetailed(options, organisation, user);
        }

        public static DefaultUser InsertDefaultUserDetailed(DbContextOptions<DataContext> options, OrganisationEntity organisation, UserEdit sourceUser)
        {
            var branch = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = organisation.Id, Name = "Branch 1" };
            var user = new UserEntity
            {
                Id = sourceUser.Id,
                FirstName = sourceUser.FirstName,
                LastName = sourceUser.LastName,
                Aliases = UserAlias.Format(sourceUser.Aliases),
                BranchId = branch.Id
            };

            using (var context = new DataContext(options))
            {
                context.Branch.Add(branch);
                context.User.Add(user);
                context.SaveChanges();
            }

            return new DefaultUser()
            {
                User = user,
                Branch = branch,
                Organisation = organisation
            };
        }

        public static DefaultMember InsertDefaultMember(DbContextOptions<DataContext> options)
        {
            var organisation = InsertDefaultOrganisation(options);

            return InsertDefaultMember(options, organisation);
        }

        public static DefaultMember InsertDefaultMember(DbContextOptions<DataContext> options, OrganisationEntity organisation, string idNumber = null)
        {
            var member = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = Guid.NewGuid().ToString(),
                LastName = Guid.NewGuid().ToString(),
                IdNumber = idNumber != null ? idNumber : Guid.NewGuid().ToString(),
                OrganisationId = organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(member);
                context.SaveChanges();
            }

            return new DefaultMember()
            {
                Organisation = organisation,
                Member = member
            };
        }

        public static CommissionTypeEntity InsertDefaultCommissionType(DbContextOptions<DataContext> options)
        {
            var type = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                Code = Guid.NewGuid().ToString(),
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(type);
                context.SaveChanges();
            };

            return type;
        }

        public static CommissionStatementEntity InsertDefaultCommissionStatement(DbContextOptions<DataContext> options, OrganisationEntity organisation, Guid? companyId = null)
        {
            companyId = companyId.HasValue ? companyId : Guid.NewGuid();
            var statement = new CommissionStatementEntity { Id = Guid.NewGuid(), OrganisationId = organisation.Id, CompanyId = companyId.Value };

            using (var context = new DataContext(options))
            {
                context.CommissionStatement.Add(statement);
                context.SaveChanges();
            }

            return statement;
        }

        public static ScopeOptions GetScopeOptions(DefaultUser user, Scope scope)
        {
            return new ScopeOptions(user.Organisation.Id, user.Branch.Id, user.User.Id, scope);
        }

        public static ScopeOptions GetScopeOptions(Guid organisationId)
        {
            return new ScopeOptions(organisationId, Guid.NewGuid(), "", Scope.User);
        }

    }
}
