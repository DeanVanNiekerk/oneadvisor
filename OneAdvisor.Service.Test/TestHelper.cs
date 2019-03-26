using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Xunit;
using Moq;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Test.Models;
using OneAdvisor.Model.Directory.Model.Lookup;

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

        public static UserEntity InsertUser(DbContextOptions<DataContext> options)
        {
            return InsertUserDetailed(options).User;
        }

        public static OrganisationEntity InsertOrganisation(DbContextOptions<DataContext> options)
        {
            var organisation = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(organisation);
                context.SaveChanges();
            }

            return organisation;
        }

        public static DefaultUser InsertUserDetailed(DbContextOptions<DataContext> options, Scope scope = Scope.Organisation)
        {
            var organisation = InsertOrganisation(options);

            return InsertUserDetailed(options, organisation, scope);
        }

        public static DefaultUser InsertUserDetailed(DbContextOptions<DataContext> options, OrganisationEntity organisation, Scope scope = Scope.Organisation)
        {
            var user = new UserEdit
            {
                Id = Guid.NewGuid(),
                FirstName = Guid.NewGuid().ToString(),
                LastName = Guid.NewGuid().ToString(),
                Scope = scope,
                Roles = new List<string>(),
                Aliases = new List<string>()
            };

            return InsertUserDetailed(options, organisation, user);
        }

        public static DefaultUser InsertUserDetailed(DbContextOptions<DataContext> options, OrganisationEntity organisation, UserEdit sourceUser)
        {
            var branch = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = organisation.Id, Name = "Branch 1" };
            var user = new UserEntity
            {
                Id = sourceUser.Id.Value,
                FirstName = sourceUser.FirstName,
                LastName = sourceUser.LastName,
                Aliases = sourceUser.Aliases,
                BranchId = branch.Id,
                Scope = sourceUser.Scope
            };

            using (var context = new DataContext(options))
            {
                context.Branch.Add(branch);
                context.Users.Add(user);
                context.SaveChanges();
            }

            return new DefaultUser()
            {
                User = user,
                Branch = branch,
                Organisation = organisation
            };
        }

        public static DefaultMember InsertMember(DbContextOptions<DataContext> options)
        {
            var organisation = InsertOrganisation(options);

            return InsertMember(options, organisation);
        }

        public static DefaultMember InsertMember(DbContextOptions<DataContext> options, OrganisationEntity organisation, string idNumber = null)
        {
            var member = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = Guid.NewGuid().ToString(),
                LastName = Guid.NewGuid().ToString(),
                IdNumber = idNumber != null ? idNumber : Guid.NewGuid().ToString(),
                OrganisationId = organisation.Id,
                Initials = Guid.NewGuid().ToString(),
                DateOfBirth = DateTime.Now.AddYears(-35)
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

        public static PolicyTypeEntity InsertPolicyType(DbContextOptions<DataContext> options)
        {
            var type = new PolicyTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                Code = Guid.NewGuid().ToString()
            };

            using (var context = new DataContext(options))
            {
                context.PolicyType.Add(type);
                context.SaveChanges();
            };

            return type;
        }

        public static CommissionTypeEntity InsertCommissionType(DbContextOptions<DataContext> options, Guid? policyTypeId = null, Guid? commissionEarningsTypeId = null)
        {
            var type = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                Code = Guid.NewGuid().ToString(),
                PolicyTypeId = policyTypeId.HasValue ? policyTypeId.Value : Guid.NewGuid(),
                CommissionEarningsTypeId = commissionEarningsTypeId.HasValue ? commissionEarningsTypeId.Value : CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(type);
                context.SaveChanges();
            };

            return type;
        }

        public static void InsertCommissionEarningsTypes(DbContextOptions<DataContext> options)
        {
            InsertCommissionEarningsType(options, new CommissionEarningsTypeEntity() { Id = CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY, Name = "ANNUAL_ANNUITY" });
            InsertCommissionEarningsType(options, new CommissionEarningsTypeEntity() { Id = CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, Name = "MONTHLY_ANNUITY" });
            InsertCommissionEarningsType(options, new CommissionEarningsTypeEntity() { Id = CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF, Name = "ONCE_OFF" });
            InsertCommissionEarningsType(options, new CommissionEarningsTypeEntity() { Id = CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS, Name = "LIFE_FIRST_YEARS" });
        }

        public static void InsertCommissionEarningsType(DbContextOptions<DataContext> options, CommissionEarningsTypeEntity entity)
        {
            using (var context = new DataContext(options))
            {
                context.CommissionEarningsType.Add(entity);
                context.SaveChanges();
            };
        }

        public static CompanyEntity InsertCompany(DbContextOptions<DataContext> options)
        {
            var company = new CompanyEntity
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString()
            };

            using (var context = new DataContext(options))
            {
                context.Company.Add(company);
                context.SaveChanges();
            };

            return company;
        }

        public static CommissionStatementEntity InsertCommissionStatement(DbContextOptions<DataContext> options, OrganisationEntity organisation, Guid? companyId = null)
        {
            companyId = companyId.HasValue ? companyId : InsertCompany(options).Id;
            var statement = new CommissionStatementEntity { Id = Guid.NewGuid(), OrganisationId = organisation.Id, CompanyId = companyId.Value };

            using (var context = new DataContext(options))
            {
                context.CommissionStatement.Add(statement);
                context.SaveChanges();
            }

            return statement;
        }

        public static ScopeOptions GetScopeOptions(DefaultUser user, Scope? scope = null)
        {
            if (scope == null)
                scope = user.User.Scope;

            return new ScopeOptions(user.Organisation.Id, user.Branch.Id, user.User.Id, scope.Value);
        }

        public static ScopeOptions GetScopeOptions(Guid organisationId)
        {
            return new ScopeOptions(organisationId, Guid.NewGuid(), Guid.NewGuid(), Scope.User);
        }

        //https://stackoverflow.com/questions/49165810/how-to-mock-usermanager-in-net-core-testing
        public static Mock<UserManager<UserEntity>> MockUserManager(List<UserEntity> ls)
        {
            var store = new Mock<IUserStore<UserEntity>>();
            var mgr = new Mock<UserManager<UserEntity>>(store.Object, null, null, null, null, null, null, null, null);
            mgr.Object.UserValidators.Add(new UserValidator<UserEntity>());
            mgr.Object.PasswordValidators.Add(new PasswordValidator<UserEntity>());

            return mgr;
        }
    }
}
