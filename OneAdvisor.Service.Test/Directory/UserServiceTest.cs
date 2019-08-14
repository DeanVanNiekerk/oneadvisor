using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{

    public class UserServiceTest
    {
        [Fact]
        public async Task GetUsers()
        {
            var options = TestHelper.GetDbContext("GetUsers");

            var userDetailed1 = TestHelper.InsertUserDetailed(options);
            var userDetailed2 = TestHelper.InsertUserDetailed(options);

            var user1 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Bob",
                LastName = "Jones",
                Email = "bobjones@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id,
                UserTypeId = Guid.NewGuid(),
            };

            var user2 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                Email = "jreacher@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id,
                UserTypeId = Guid.NewGuid(),
            };

            var user3 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Joe",
                LastName = "Soap",
                Email = "js@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed2.Branch.Id,
                UserTypeId = Guid.NewGuid(),
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
                Assert.Equal(3, users.TotalItems);
                Assert.Equal(3, users.Items.Count());

                var actual1 = users.Items.ToArray()[0];
                Assert.Equal(userDetailed1.User.Id, actual1.Id);

                var actual2 = users.Items.ToArray()[1];
                Assert.Equal(user1.Id, actual2.Id);
                Assert.Equal(user1.FirstName, actual2.FirstName);
                Assert.Equal(user1.LastName, actual2.LastName);
                Assert.Equal(user1.Email, actual2.Email);
                Assert.Equal(user1.Scope, actual2.Scope);
                Assert.Equal(user1.BranchId, actual2.BranchId);
                Assert.Equal(user1.UserTypeId, actual2.UserTypeId);
                Assert.Equal(userDetailed1.Branch.Name, actual2.BranchName);
                Assert.Equal(userDetailed1.Organisation.Id, actual2.OrganisationId);
                Assert.Equal(userDetailed1.Organisation.Name, actual2.OrganisationName);


                var actual3 = users.Items.ToArray()[2];
                Assert.Equal(user2.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task GetUser()
        {
            var options = TestHelper.GetDbContext("GetUser");

            var userDetailed1 = TestHelper.InsertUserDetailed(options);
            var userDetailed2 = TestHelper.InsertUserDetailed(options);

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
                Aliases = new List<string>() { "dean " },
                UserTypeId = Guid.NewGuid(),
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
                Assert.Equal(user2.Id, user.Id);
                Assert.Equal(user2.FirstName, user.FirstName);
                Assert.Equal(user2.LastName, user.LastName);
                Assert.Equal(user2.Email, user.Email);
                Assert.Equal(user2.Scope, user.Scope);
                Assert.Equal(user2.BranchId, user.BranchId);
                Assert.Equal(user2.UserTypeId, user.UserTypeId);
                Assert.Equal(user2.Aliases, user.Aliases);
                Assert.Equal(roles, user.Roles);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                user = await service.GetUser(scope, user2.Id);
                Assert.Null(user);
            }
        }

        [Fact]
        public async Task InsertUser()
        {
            var options = TestHelper.GetDbContext("InsertUser");

            var userDetailed1 = TestHelper.InsertUserDetailed(options);
            var userDetailed2 = TestHelper.InsertUserDetailed(options);

            var noRoles = new List<string>();

            var roles = new List<string>() {
                "role1", "role2"
            };

            var user = new UserEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                UserName = "jreacher",
                Email = "jreacher@gmail.com",
                Scope = Scope.Organisation,
                BranchId = userDetailed1.Branch.Id,
                Aliases = new List<string>() { "dean " },
                Roles = roles,
                UserTypeId = Guid.NewGuid(),
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
                var result = await service.InsertUser(scope, user, "Test@123!", true);

                //Then
                Assert.True(result.Success);
                Assert.Equal(user.FirstName, addedUser.FirstName);
                Assert.Equal(user.LastName, addedUser.LastName);
                Assert.Equal(user.Email, addedUser.Email);
                Assert.Equal(user.UserName, addedUser.UserName);
                Assert.Equal(user.Scope, addedUser.Scope);
                Assert.Equal(user.BranchId, addedUser.BranchId);
                Assert.Equal(user.UserTypeId, addedUser.UserTypeId);
                Assert.Equal(user.Aliases, addedUser.Aliases);
                Assert.Equal("Test@123!", addedPassword);
                Assert.Equal(roles, addedRoles);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                result = await service.InsertUser(scope, user);
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task UpdateUser()
        {
            var options = TestHelper.GetDbContext("UpdateUser");

            var userDetailed1 = TestHelper.InsertUserDetailed(options);
            var userDetailed2 = TestHelper.InsertUserDetailed(options);

            var noRoles = new List<string>();

            var roles = new List<string>() {
                "role1", "role2"
            };

            var userEntity = new UserEntity()
            {
                Id = Guid.NewGuid(),
                BranchId = userDetailed1.Branch.Id,
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
                    Roles = roles,
                    UserTypeId = Guid.NewGuid(),
                };


                //When
                var scope = TestHelper.GetScopeOptions(userDetailed1, Scope.Organisation);
                var result = await service.UpdateUser(scope, user);

                //Then
                Assert.True(result.Success);
                Assert.Equal(user.FirstName, updatedUser.FirstName);
                Assert.Equal(user.LastName, updatedUser.LastName);
                Assert.Equal(user.Email, updatedUser.Email);
                Assert.Equal(user.UserName, updatedUser.UserName);
                Assert.Equal(user.Scope, updatedUser.Scope);
                Assert.Equal(user.BranchId, updatedUser.BranchId);
                Assert.Equal(user.UserTypeId, updatedUser.UserTypeId);
                Assert.Equal(user.Aliases, updatedUser.Aliases);
                Assert.Equal(roles, addedRoles);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                result = await service.UpdateUser(scope, user);
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task GetUsersSimple()
        {
            var options = TestHelper.GetDbContext("GetUsersSimple");

            var userDetailed1 = TestHelper.InsertUserDetailed(options);
            var userDetailed2 = TestHelper.InsertUserDetailed(options);

            var user1 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Bob",
                LastName = "Jones",
                BranchId = userDetailed1.Branch.Id,
                UserTypeId = Guid.NewGuid(),
            };

            var user2 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jack",
                LastName = "Reacher",
                BranchId = userDetailed1.Branch.Id,
                UserTypeId = Guid.NewGuid(),
            };

            var user3 = new UserEntity()
            {
                Id = Guid.NewGuid(),
                FirstName = "Joe",
                LastName = "Soap",
                BranchId = userDetailed2.Branch.Id,
                UserTypeId = Guid.NewGuid(),
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
                Assert.Equal(3, users.TotalItems);
                Assert.Equal(3, users.Items.Count());

                var actual1 = users.Items.ToArray()[0];
                Assert.Equal(userDetailed1.User.Id, actual1.Id);

                var actual2 = users.Items.ToArray()[1];
                Assert.Equal(user1.Id, actual2.Id);
                Assert.Equal(user1.FirstName, actual2.FirstName);
                Assert.Equal(user1.LastName, actual2.LastName);
                Assert.Equal(user1.UserTypeId, actual2.UserTypeId);

                var actual3 = users.Items.ToArray()[2];
                Assert.Equal(user2.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task GetUserSimple()
        {
            var options = TestHelper.GetDbContext("GetUserSimple");

            var userDetailed1 = TestHelper.InsertUserDetailed(options);
            var userDetailed2 = TestHelper.InsertUserDetailed(options);

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
                BranchId = userDetailed1.Branch.Id,
                UserTypeId = Guid.NewGuid(),
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
                Assert.Equal(user2.Id, user.Id);
                Assert.Equal(user2.FirstName, user.FirstName);
                Assert.Equal(user2.LastName, user.LastName);
                Assert.Equal(user2.BranchId, user.BranchId);
                Assert.Equal(user2.UserTypeId, user.UserTypeId);

                //Scope check
                scope = TestHelper.GetScopeOptions(userDetailed2, Scope.Organisation);
                user = await service.GetUserSimple(scope, user2.Id);
                Assert.Null(user);
            }
        }
    }
}