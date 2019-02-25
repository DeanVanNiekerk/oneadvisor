using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class UserServiceTest
    {
        [TestMethod]
        public async Task GetUsers()
        {
            var options = TestHelper.GetDbContext("GetUsers");

            var userDetailed1 = TestHelper.InsertDefaultUserDetailed(options);
            var userDetailed2 = TestHelper.InsertDefaultUserDetailed(options);

            var user1 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Bob",
                LastName = "Jones",
                Email = "bobjones@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id
            };

            var user2 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                Email = "jreacher@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id
            };

            var user3 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Joe",
                LastName = "Soap",
                Email = "js@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed2.Branch.Id
            };

            using (var context = new DataContext(options))
            {
                context.Users.Add(user1);
                context.Users.Add(user3);
                context.Users.Add(user2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var userManager = TestHelper.MockUserManager(context.Users.ToList());
                var service = new UserService(context, userManager.Object);

                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var queryOptions = new UserQueryOptions(scope, 10, 1);
                var users = await service.GetUsers(queryOptions);

                //Then
                Assert.AreEqual(3, users.TotalItems);
                Assert.AreEqual(3, users.Items.Count());

                var actual1 = users.Items.ToArray()[0];
                Assert.AreEqual(userDetailed1.User.Id, actual1.Id);

                var actual2 = users.Items.ToArray()[1];
                Assert.AreEqual(user1.Id, actual2.Id);
                Assert.AreEqual(user1.FirstName, actual2.FirstName);
                Assert.AreEqual(user1.LastName, actual2.LastName);
                Assert.AreEqual(user1.Email, actual2.Email);
                Assert.AreEqual(user1.Scope, actual2.Scope);
                Assert.AreEqual(user1.BranchId, actual2.BranchId);
                Assert.AreEqual(userDetailed1.Branch.Name, actual2.BranchName);
                Assert.AreEqual(userDetailed1.Organisation.Id, actual2.OrganisationId);
                Assert.AreEqual(userDetailed1.Organisation.Name, actual2.OrganisationName);

                var actual3 = users.Items.ToArray()[2];
                Assert.AreEqual(user2.Id, actual3.Id);
            }
        }

        [TestMethod]
        public async Task GetUser()
        {
            var options = TestHelper.GetDbContext("GetUser");

            var userDetailed1 = TestHelper.InsertDefaultUserDetailed(options);
            var userDetailed2 = TestHelper.InsertDefaultUserDetailed(options);

            var roles = new List<string>() {
                "role1", "role2"
            };

            var user1 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                BranchId = userDetailed1.Branch.Id
            };

            var user2 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                Email = "jreacher@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id,
                Aliases = new List<string>() { "dean " }
            };

            using (var context = new DataContext(options))
            {
                context.Users.Add(user1);
                context.Users.Add(user2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var userManager = TestHelper.MockUserManager(context.Users.ToList());
                userManager.Setup(x => x.GetRolesAsync(It.IsAny<UserEntity>())).ReturnsAsync(roles);

                var service = new UserService(context, userManager.Object);

                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var user = await service.GetUser(scope, user2.Id);

                //Then
                Assert.AreEqual(user2.Id, user.Id);
                Assert.AreEqual(user2.FirstName, user.FirstName);
                Assert.AreEqual(user2.LastName, user.LastName);
                Assert.AreEqual(user2.Email, user.Email);
                Assert.AreEqual(user2.Scope, user.Scope);
                Assert.AreEqual(user2.BranchId, user.BranchId);
                Assert.AreEqual(user2.Aliases, user.Aliases);
                Assert.AreEqual(roles, user.Roles);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                user = await service.GetUser(scope, user2.Id);
                Assert.IsNull(user);
            }
        }

        [TestMethod]
        public async Task InsertUser()
        {
            var options = TestHelper.GetDbContext("InsertUser");

            var userDetailed1 = TestHelper.InsertDefaultUserDetailed(options);
            var userDetailed2 = TestHelper.InsertDefaultUserDetailed(options);

            var noRoles = new List<string>();

            var roles = new List<string>() {
                "role1", "role2"
            };

            var user = new UserEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                Email = "jreacher@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id,
                Aliases = new List<string>() { "dean " },
                Roles = roles
            };

            using (var context = new DataContext(options))
            {
                UserEntity addedUser = null;
                string addedPassword = null;
                IEnumerable<string> addedRoles = null;

                var userManager = TestHelper.MockUserManager(context.Users.ToList());
                userManager.Setup(x => x.GetRolesAsync(It.IsAny<UserEntity>())).ReturnsAsync(noRoles);
                userManager.Setup(x => x.RemoveFromRolesAsync(It.IsAny<UserEntity>(), It.IsAny<IEnumerable<string>>())).ReturnsAsync(IdentityResult.Success);
                userManager
                   .Setup(x => x.AddToRolesAsync(It.IsAny<UserEntity>(), It.IsAny<IEnumerable<string>>()))
                   .ReturnsAsync(IdentityResult.Success)
                   .Callback<UserEntity, IEnumerable<string>>((u, r) =>
                   {
                       addedRoles = r;
                   });
                userManager
                    .Setup(x => x.CreateAsync(It.IsAny<UserEntity>(), It.IsAny<string>()))
                    .ReturnsAsync(IdentityResult.Success)
                    .Callback<UserEntity, string>((u, p) =>
                    {
                        addedUser = u;
                        addedPassword = p;
                    });

                var service = new UserService(context, userManager.Object);

                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var result = await service.InsertUser(scope, user, "Test123!");

                //Then
                Assert.IsTrue(result.Success);
                Assert.AreEqual(user.FirstName, addedUser.FirstName);
                Assert.AreEqual(user.LastName, addedUser.LastName);
                Assert.AreEqual(user.Email, addedUser.Email);
                Assert.AreEqual(user.Scope, addedUser.Scope);
                Assert.AreEqual(user.BranchId, addedUser.BranchId);
                Assert.AreEqual(user.Aliases, addedUser.Aliases);
                Assert.AreEqual("Test123!", addedPassword);
                Assert.AreEqual(roles, addedRoles);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                result = await service.InsertUser(scope, user, "Test123!");
                Assert.IsFalse(result.Success);
            }
        }

        [TestMethod]
        public async Task UpdateUser()
        {
            var options = TestHelper.GetDbContext("UpdateUser");

            var userDetailed1 = TestHelper.InsertDefaultUserDetailed(options);
            var userDetailed2 = TestHelper.InsertDefaultUserDetailed(options);

            var noRoles = new List<string>();

            var roles = new List<string>() {
                "role1", "role2"
            };

            var userEntity = new UserEntity()
            {
                Id = Guid.NewGuid(),
                BranchId = userDetailed1.Branch.Id
            };

            using (var context = new DataContext(options))
            {
                context.Users.Add(userEntity);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                UserEntity updatedUser = null;
                IEnumerable<string> addedRoles = null;

                var userManager = TestHelper.MockUserManager(context.Users.ToList());
                userManager.Setup(x => x.GetRolesAsync(It.IsAny<UserEntity>())).ReturnsAsync(noRoles);
                userManager.Setup(x => x.RemoveFromRolesAsync(It.IsAny<UserEntity>(), It.IsAny<IEnumerable<string>>())).ReturnsAsync(IdentityResult.Success);
                userManager
                   .Setup(x => x.AddToRolesAsync(It.IsAny<UserEntity>(), It.IsAny<IEnumerable<string>>()))
                   .ReturnsAsync(IdentityResult.Success)
                   .Callback<UserEntity, IEnumerable<string>>((u, r) =>
                   {
                       addedRoles = r;
                   });

                userManager
                    .Setup(x => x.UpdateAsync(It.IsAny<UserEntity>()))
                    .ReturnsAsync(IdentityResult.Success)
                    .Callback<UserEntity>((u) =>
                    {
                        updatedUser = u;
                    });

                var service = new UserService(context, userManager.Object);

                var user = new UserEdit()
                {
                    Id = userEntity.Id,
                    FirstName = "Jack",
                    LastName = "Reacher",
                    Email = "jreacher@gmail.com",
                    Scope = Scope.Organisation,
                    BranchId = userDetailed1.Branch.Id,
                    Aliases = new List<string>() { "dean " },
                    Roles = roles
                };


                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var result = await service.UpdateUser(scope, user);

                //Then
                Assert.IsTrue(result.Success);
                Assert.AreEqual(user.FirstName, updatedUser.FirstName);
                Assert.AreEqual(user.LastName, updatedUser.LastName);
                Assert.AreEqual(user.Email, updatedUser.Email);
                Assert.AreEqual(user.Scope, updatedUser.Scope);
                Assert.AreEqual(user.BranchId, updatedUser.BranchId);
                Assert.AreEqual(user.Aliases, updatedUser.Aliases);
                Assert.AreEqual(roles, addedRoles);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                result = await service.UpdateUser(scope, user);
                Assert.IsFalse(result.Success);
            }
        }

        [TestMethod]
        public async Task GetUsersSimple()
        {
            var options = TestHelper.GetDbContext("GetUsersSimple");

            var userDetailed1 = TestHelper.InsertDefaultUserDetailed(options);
            var userDetailed2 = TestHelper.InsertDefaultUserDetailed(options);

            var user1 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Bob",
                LastName = "Jones",
                BranchId = userDetailed1.Branch.Id
            };

            var user2 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                BranchId = userDetailed1.Branch.Id
            };

            var user3 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Joe",
                LastName = "Soap",
                BranchId = userDetailed2.Branch.Id
            };

            using (var context = new DataContext(options))
            {
                context.Users.Add(user1);
                context.Users.Add(user3);
                context.Users.Add(user2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var userManager = TestHelper.MockUserManager(context.Users.ToList());
                var service = new UserService(context, userManager.Object);

                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var users = await service.GetUsersSimple(scope);

                //Then
                Assert.AreEqual(3, users.TotalItems);
                Assert.AreEqual(3, users.Items.Count());

                var actual1 = users.Items.ToArray()[0];
                Assert.AreEqual(userDetailed1.User.Id, actual1.Id);

                var actual2 = users.Items.ToArray()[1];
                Assert.AreEqual(user1.Id, actual2.Id);
                Assert.AreEqual(user1.FirstName, actual2.FirstName);
                Assert.AreEqual(user1.LastName, actual2.LastName);

                var actual3 = users.Items.ToArray()[2];
                Assert.AreEqual(user2.Id, actual3.Id);
            }
        }

        [TestMethod]
        public async Task GetUserSimple()
        {
            var options = TestHelper.GetDbContext("GetUserSimple");

            var userDetailed1 = TestHelper.InsertDefaultUserDetailed(options);
            var userDetailed2 = TestHelper.InsertDefaultUserDetailed(options);

            var user1 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                BranchId = userDetailed1.Branch.Id
            };

            var user2 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                BranchId = userDetailed1.Branch.Id
            };

            using (var context = new DataContext(options))
            {
                context.Users.Add(user1);
                context.Users.Add(user2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var userManager = TestHelper.MockUserManager(context.Users.ToList());
                var service = new UserService(context, userManager.Object);

                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var user = await service.GetUserSimple(scope, user2.Id);

                //Then
                Assert.AreEqual(user2.Id, user.Id);
                Assert.AreEqual(user2.FirstName, user.FirstName);
                Assert.AreEqual(user2.LastName, user.LastName);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                user = await service.GetUserSimple(scope, user2.Id);
                Assert.IsNull(user);
            }
        }
    }
}