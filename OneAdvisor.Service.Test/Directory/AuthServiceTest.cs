using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class AuthServiceTest
    {
        [TestMethod]
        public async Task GetScope_Global()
        {
            var service = new AuthService(null);

            var roleIds = new List<string>() { "super_administrator" };

            //When
            var scope = await service.GetScope("", roleIds, "", "");

            Assert.AreEqual(null, scope.UserId);
            Assert.AreEqual(null, scope.BranchId);
            Assert.AreEqual(null, scope.OrganisationId);
        }

        [TestMethod]
        public async Task GetScope_OrganisationLevel()
        {
            var options = TestHelper.GetDbContext("GetScope_OrganisationLevel");

            //Given
            AddDefaultUseCases(options);

            var user = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new AuthService(context);

                var roleIds = new List<string>() { "admin_organisation" };

                //When
                var scope = await service.GetScope(user.User.Id, roleIds, "mem_view_members_branch", "mem_view_members_organisation");

                Assert.AreEqual(null, scope.UserId);
                Assert.AreEqual(null, scope.BranchId);
                Assert.AreEqual(user.Organisation.Id, scope.OrganisationId);

            }
        }

        [TestMethod]
        public async Task GetScope_BranchLevel()
        {
            var options = TestHelper.GetDbContext("GetScope_BranchLevel");

            //Given
            AddDefaultUseCases(options);

            var user = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new AuthService(context);

                var roleIds = new List<string>() { "admin_branch" };

                //When
                var scope = await service.GetScope(user.User.Id, roleIds, "mem_view_members_branch", "mem_view_members_organisation");

                Assert.AreEqual(null, scope.UserId);
                Assert.AreEqual(user.Branch.Id, scope.BranchId);
                Assert.AreEqual(null, scope.OrganisationId);

            }
        }

        [TestMethod]
        public async Task GetScope_UserLevel()
        {
            var options = TestHelper.GetDbContext("GetScope_UserLevel");

            //Given
            AddDefaultUseCases(options);

            var user = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new AuthService(context);

                var roleIds = new List<string>() { "admin_user" };

                //When
                var scope = await service.GetScope(user.User.Id, roleIds, "mem_view_members_branch", "mem_view_members_organisation");

                Assert.AreEqual(user.User.Id, scope.UserId);
                Assert.AreEqual(null, scope.BranchId);
                Assert.AreEqual(null, scope.OrganisationId);

            }
        }

        public void AddDefaultUseCases(DbContextOptions<DataContext> options)
        {
            //Given
            var applicationId = Guid.NewGuid();
            var uc1 = new UseCaseEntity { Id = "mem_view_members_user", Name = "View Members - User Level", ApplicationId = applicationId };
            var uc2 = new UseCaseEntity { Id = "mem_view_members_branch", Name = "View Members - Broker Level", ApplicationId = applicationId };
            var uc3 = new UseCaseEntity { Id = "mem_view_members_organisation", Name = "View Members - Organisation Level", ApplicationId = applicationId };

            var rtuc1 = new RoleToUseCaseEntity { UseCaseId = "mem_view_members_user", RoleId = "admin_user" };

            var rtuc2 = new RoleToUseCaseEntity { UseCaseId = "mem_view_members_user", RoleId = "admin_branch" };
            var rtuc3 = new RoleToUseCaseEntity { UseCaseId = "mem_view_members_branch", RoleId = "admin_branch" };

            var rtuc4 = new RoleToUseCaseEntity { UseCaseId = "mem_view_members_user", RoleId = "admin_organisation" };
            var rtuc5 = new RoleToUseCaseEntity { UseCaseId = "mem_view_members_branch", RoleId = "admin_organisation" };
            var rtuc6 = new RoleToUseCaseEntity { UseCaseId = "mem_view_members_organisation", RoleId = "admin_organisation" };

            using (var context = new DataContext(options))
            {
                context.UseCase.Add(uc1);
                context.UseCase.Add(uc2);
                context.UseCase.Add(uc3);

                context.RoleToUseCase.Add(rtuc1);
                context.RoleToUseCase.Add(rtuc2);
                context.RoleToUseCase.Add(rtuc3);
                context.RoleToUseCase.Add(rtuc4);
                context.RoleToUseCase.Add(rtuc5);
                context.RoleToUseCase.Add(rtuc6);

                context.SaveChanges();
            }
        }
    }
}