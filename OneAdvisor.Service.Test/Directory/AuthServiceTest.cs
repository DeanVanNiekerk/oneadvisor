using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.User;
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
            var scope = await service.GetScope("", roleIds, Scope.User);

            Assert.AreEqual(null, scope.UserId);
            Assert.AreEqual(null, scope.BranchId);
            Assert.AreEqual(null, scope.OrganisationId);
        }

        [TestMethod]
        public async Task GetScope_OrganisationLevel()
        {
            var options = TestHelper.GetDbContext("GetScope_OrganisationLevel");

            var user = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new AuthService(context);

                var roleIds = new List<string>() { "admin" };

                //When
                var scope = await service.GetScope(user.User.Id, roleIds, Scope.Organisation);

                Assert.AreEqual(null, scope.UserId);
                Assert.AreEqual(null, scope.BranchId);
                Assert.AreEqual(user.Organisation.Id, scope.OrganisationId);

            }
        }

        [TestMethod]
        public async Task GetScope_BranchLevel()
        {
            var options = TestHelper.GetDbContext("GetScope_BranchLevel");

            var user = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new AuthService(context);

                var roleIds = new List<string>() { "admin" };

                //When
                var scope = await service.GetScope(user.User.Id, roleIds, Scope.Branch);

                Assert.AreEqual(null, scope.UserId);
                Assert.AreEqual(user.Branch.Id, scope.BranchId);
                Assert.AreEqual(null, scope.OrganisationId);

            }
        }

        [TestMethod]
        public async Task GetScope_UserLevel()
        {
            var options = TestHelper.GetDbContext("GetScope_UserLevel");

            var user = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new AuthService(context);

                var roleIds = new List<string>() { "admin" };

                //When
                var scope = await service.GetScope(user.User.Id, roleIds, Scope.User);

                Assert.AreEqual(user.User.Id, scope.UserId);
                Assert.AreEqual(null, scope.BranchId);
                Assert.AreEqual(null, scope.OrganisationId);

            }
        }

    }
}