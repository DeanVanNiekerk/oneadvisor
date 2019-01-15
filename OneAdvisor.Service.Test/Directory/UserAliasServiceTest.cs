using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Directory.Model.UserAlias;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class UserAliasServiceTest
    {

        [TestMethod]
        public async Task GetUserAliases_None()
        {
            var options = TestHelper.GetDbContext("GetUserAliases_None");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            //Nothing
            using (var context = new DataContext(options))
            {
                var service = new UserAliasService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.User);
                var queryOptions = new UserAliasQueryOptions(scope);
                var actual = await service.GetUserAliases(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 0);
                Assert.AreEqual(actual.Items.Count(), 0);
            }
        }

        [TestMethod]
        public async Task GetUserAliases_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetUserAliases_FilterAndSort");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var userAlias1 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user1.User.Id, Name = "A UserAlias 1" };
            var userAlias2 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user2.User.Id, Name = "B UserAlias 2" };
            var userAlias3 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user1.User.Id, Name = "C UserAlias 3" };
            var userAlias4 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user2.User.Id, Name = "D UserAlias 4" };
            var userAlias5 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user1.User.Id, Name = "E UserAlias 5" };
            var userAlias6 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user1.User.Id, Name = "F UserAlias 6" };
            var userAlias7 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user3.User.Id, Name = "G UserAlias 7" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.UserAlias.Add(userAlias6);
                context.UserAlias.Add(userAlias1);
                context.UserAlias.Add(userAlias2);
                context.UserAlias.Add(userAlias4);
                context.UserAlias.Add(userAlias5);
                context.UserAlias.Add(userAlias3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new UserAliasService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new UserAliasQueryOptions(scope, $"userId={user1.User.Id.ToString()}");
                var actual = await service.GetUserAliases(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 6);

                var userAliases = actual.Items.ToArray();

                Assert.AreEqual(userAliases.Count(), 4);

                var actual1 = userAliases[0];
                Assert.AreEqual(userAlias1.Id, actual1.Id);
                Assert.AreEqual(userAlias1.Name, actual1.Name);
                Assert.AreEqual(userAlias1.UserId, user1.User.Id);

                var actual2 = userAliases[1];
                Assert.AreEqual(userAlias3.Id, actual2.Id);
                Assert.AreEqual(userAlias3.Name, actual2.Name);
                Assert.AreEqual(userAlias3.UserId, user1.User.Id);

                var actual6 = userAliases[3];
                Assert.AreEqual(userAlias6.Id, actual6.Id);
                Assert.AreEqual(userAlias6.Name, actual6.Name);
                Assert.AreEqual(userAlias6.UserId, user1.User.Id);
            }
        }

        [TestMethod]
        public async Task GetUserAlias()
        {
            var options = TestHelper.GetDbContext("GetUserAlias");

            //Given
            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var userAlias1 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user1.User.Id, Name = "UserAlias 1" };
            var userAlias2 = new UserAliasEntity { Id = Guid.NewGuid(), UserId = user2.User.Id, Name = "UserAlias 2" };

            using (var context = new DataContext(options))
            {
                context.UserAlias.Add(userAlias1);
                context.UserAlias.Add(userAlias2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new UserAliasService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetUserAlias(scope, userAlias1.Id);

                //Then
                Assert.AreEqual(userAlias1.Id, actual.Id);
                Assert.AreEqual(userAlias1.UserId, actual.UserId);
                Assert.AreEqual(userAlias1.Name, actual.Name);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                actual = await service.GetUserAlias(scope, userAlias1.Id);

                //Then
                Assert.IsNull(actual);
            }
        }

        [TestMethod]
        public async Task InsertUserAlias()
        {
            var options = TestHelper.GetDbContext("InsertUserAlias");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var userAlias = new UserAlias()
            {
                UserId = user1.User.Id,
                Name = "UserAlias 1"
            };

            using (var context = new DataContext(options))
            {
                var service = new UserAliasService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.InsertUserAlias(scope, userAlias);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.UserAlias.FindAsync(((UserAlias)result.Tag).Id);
                Assert.AreEqual(userAlias.UserId, actual.UserId);
                Assert.AreEqual(userAlias.Name, actual.Name);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.InsertUserAlias(scope, userAlias);

                //Then
                Assert.IsFalse(result.Success);
            }
        }

        [TestMethod]
        public async Task UpdateUserAlias()
        {
            var options = TestHelper.GetDbContext("UpdateUserAlias");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var userAlias1 = new UserAliasEntity { Id = Guid.NewGuid(), Name = "UserAlias 1", UserId = user1.User.Id };
            var userAlias2 = new UserAliasEntity { Id = Guid.NewGuid(), Name = "UserAlias 2", UserId = user1.User.Id };

            using (var context = new DataContext(options))
            {
                context.UserAlias.Add(userAlias1);
                context.UserAlias.Add(userAlias2);

                context.SaveChanges();
            }

            var userAlias = new UserAlias()
            {
                Id = userAlias2.Id,
                Name = "UserAlias 1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new UserAliasService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.UpdateUserAlias(scope, userAlias);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.UserAlias.FindAsync(userAlias.Id);
                Assert.AreEqual(user1.User.Id, actual.UserId); //Should not have changed
                Assert.AreEqual(userAlias.Name, actual.Name);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.UpdateUserAlias(scope, userAlias);

                //Then
                Assert.IsFalse(result.Success);
            }
        }

    }
}