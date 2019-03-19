using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Service.Directory;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Service.Test.Directory
{

    public class RoleServiceTest
    {
        [Fact]
        public async Task GetRoles()
        {
            var options = TestHelper.GetDbContext("GetRoles");

            //Given
            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_1", Description = "Role 1", ApplicationId = Guid.NewGuid() };
            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_2", Description = "Role 2", ApplicationId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.Roles.Add(role1);
                context.Roles.Add(role2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var list = await service.GetRoles();

                //Then
                Assert.Equal(2, list.Count);

                var actual1 = list[0];
                Assert.Equal(role1.Id, actual1.Id);
                Assert.Equal(role1.Name, actual1.Name);
                Assert.Equal(role1.Description, actual1.Description);
                Assert.Equal(role1.ApplicationId, actual1.ApplicationId);

                var actual2 = list[1];
                Assert.Equal(role2.Id, actual2.Id);
                Assert.Equal(role2.Name, actual2.Name);
                Assert.Equal(role2.Description, actual2.Description);
                Assert.Equal(role2.ApplicationId, actual2.ApplicationId);

            }
        }

        [Fact]
        public async Task GetRole()
        {
            var options = TestHelper.GetDbContext("GetRole");

            //Given
            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_1", Description = "Role 1", ApplicationId = Guid.NewGuid() };
            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_2", Description = "Role 2", ApplicationId = Guid.NewGuid() };
            var role3 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_3", Description = "Role 3", ApplicationId = Guid.NewGuid() };

            var roleToUseCase1 = new RoleToUseCaseEntity { RoleId = role1.Id, UseCaseId = "uc1" };
            var roleToUseCase2 = new RoleToUseCaseEntity { RoleId = role1.Id, UseCaseId = "uc2" };

            var roleToUseCase3 = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = "uc3" };

            using (var context = new DataContext(options))
            {
                context.Roles.Add(role3);
                context.Roles.Add(role1);
                context.Roles.Add(role2);

                context.RoleToUseCase.Add(roleToUseCase1);
                context.RoleToUseCase.Add(roleToUseCase2);
                context.RoleToUseCase.Add(roleToUseCase3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var actual = await service.GetRole(role1.Id);

                //Then
                Assert.Equal(role1.Id, actual.Id);
                Assert.Equal(role1.Name, actual.Name);
                Assert.Equal(role1.Description, actual.Description);
                Assert.Equal(role1.ApplicationId, actual.ApplicationId);
                Assert.Equal(2, actual.UseCaseIds.Count());
                Assert.Equal("uc1", actual.UseCaseIds.ToArray()[0]);
                Assert.Equal("uc2", actual.UseCaseIds.ToArray()[1]);

            }
        }

        [Fact]
        public async Task HasUseCase_DoesNotHave()
        {
            var options = TestHelper.GetDbContext("HasUseCase_DoesNotHave");

            //Given
            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_1" };
            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_2" };

            var useCase = new UseCaseEntity { Id = "usecase_1" };

            var roleToUseCase = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = useCase.Id };

            using (var context = new DataContext(options))
            {
                context.Roles.Add(role1);
                context.Roles.Add(role2);

                context.UseCase.Add(useCase);

                context.RoleToUseCase.Add(roleToUseCase);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var actual = await service.HasUseCase(new List<string>() { role1.Name }, new List<string>() { useCase.Id });

                //Then
                Assert.False(actual);
            }
        }

        [Fact]
        public async Task HasUseCase_DoesHave()
        {
            var options = TestHelper.GetDbContext("HasUseCase_DoesHave");

            //Given
            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_1" };
            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_2" };

            var useCase = new UseCaseEntity { Id = "usecase_1" };

            var roleToUseCase = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = useCase.Id };

            using (var context = new DataContext(options))
            {
                context.Roles.Add(role1);
                context.Roles.Add(role2);

                context.UseCase.Add(useCase);

                context.RoleToUseCase.Add(roleToUseCase);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var actual = await service.HasUseCase(new List<string>() { role2.Name }, new List<string>() { useCase.Id });

                //Then
                Assert.True(actual);
            }
        }

        [Fact]
        public async Task HasUseCase_DoesHave_List()
        {
            var options = TestHelper.GetDbContext("HasUseCase_DoesHave_List");

            //Given
            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_1" };
            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_2" };
            var role3 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_3" };
            var role4 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_4" };

            var useCase1 = new UseCaseEntity { Id = "usecase_1" };
            var useCase2 = new UseCaseEntity { Id = "usecase_2" };
            var useCase3 = new UseCaseEntity { Id = "usecase_3" };
            var useCase4 = new UseCaseEntity { Id = "usecase_4" };
            var useCase5 = new UseCaseEntity { Id = "usecase_5" };

            var roleToUseCase1 = new RoleToUseCaseEntity { RoleId = role1.Id, UseCaseId = useCase1.Id };
            var roleToUseCase2 = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = useCase2.Id };
            var roleToUseCase3 = new RoleToUseCaseEntity { RoleId = role3.Id, UseCaseId = useCase3.Id };
            var roleToUseCase4 = new RoleToUseCaseEntity { RoleId = role4.Id, UseCaseId = useCase4.Id };
            var roleToUseCase5 = new RoleToUseCaseEntity { RoleId = role1.Id, UseCaseId = useCase5.Id };

            using (var context = new DataContext(options))
            {
                context.Roles.Add(role1);
                context.Roles.Add(role2);
                context.Roles.Add(role3);
                context.Roles.Add(role4);

                context.UseCase.Add(useCase1);
                context.UseCase.Add(useCase2);
                context.UseCase.Add(useCase3);
                context.UseCase.Add(useCase4);
                context.UseCase.Add(useCase5);

                context.RoleToUseCase.Add(roleToUseCase1);
                context.RoleToUseCase.Add(roleToUseCase2);
                context.RoleToUseCase.Add(roleToUseCase3);
                context.RoleToUseCase.Add(roleToUseCase4);
                context.RoleToUseCase.Add(roleToUseCase5);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var actual = await service.HasUseCase(new List<string>() { role1.Name, role2.Name }, new List<string>() { useCase1.Id, useCase5.Id });

                //Then
                Assert.True(actual);
            }
        }

        [Fact]
        public async Task InsertRole()
        {
            var options = TestHelper.GetDbContext("InsertRole");

            var role = new RoleEdit()
            {
                Name = "Branch 1",
                Description = "Branch 1 Desc",
                ApplicationId = Guid.NewGuid(),
                UseCaseIds = new List<string>() { "uc1", "uc2" }
            };

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var result = await service.InsertRole(role);

                //Then
                Assert.True(result.Success);

                var actual = await context.Roles.FindAsync(((RoleEdit)result.Tag).Id);
                Assert.Equal(role.Name, actual.Name);
                Assert.Equal(role.Description, actual.Description);
                Assert.Equal(role.ApplicationId, actual.ApplicationId);

                var roleToUseCases = await context.RoleToUseCase.Where(r => r.RoleId == actual.Id).ToListAsync();
                Assert.Equal(2, roleToUseCases.Count);
                Assert.Equal("uc1", roleToUseCases[0].UseCaseId);
                Assert.Equal("uc2", roleToUseCases[1].UseCaseId);
            }
        }

        [Fact]
        public async Task UpdateRole()
        {
            var options = TestHelper.GetDbContext("UpdateRole");

            //Given
            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "Role 1", Description = "Role 1 Desc", ApplicationId = Guid.NewGuid() };
            var ru1 = new RoleToUseCaseEntity { RoleId = role1.Id, UseCaseId = "uc1" };

            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "Role 2", Description = "Role 2 Desc", ApplicationId = Guid.NewGuid() };
            var ru2 = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = "uc2" };

            using (var context = new DataContext(options))
            {
                context.Roles.Add(role1);
                context.RoleToUseCase.Add(ru1);

                context.Roles.Add(role2);
                context.RoleToUseCase.Add(ru2);

                context.SaveChanges();
            }

            var role = new RoleEdit()
            {
                Id = role2.Id,
                Name = "Branch 2 - updated",
                Description = "Branch 2 Desc - updated",
                ApplicationId = Guid.NewGuid(),
                UseCaseIds = new List<string>() { "uc4", "uc5" }
            };

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var result = await service.UpdateRole(role);

                //Then
                Assert.True(result.Success);

                var actual = await context.Roles.FindAsync(role.Id);
                Assert.Equal(role.Name, actual.Name);
                Assert.Equal(role.Description, actual.Description);
                Assert.Equal(role.ApplicationId, actual.ApplicationId);

                var roleToUseCases = await context.RoleToUseCase.Where(r => r.RoleId == actual.Id).ToListAsync();
                Assert.Equal(2, roleToUseCases.Count);
                Assert.Equal("uc4", roleToUseCases[0].UseCaseId);
                Assert.Equal("uc5", roleToUseCases[1].UseCaseId);
            }
        }

    }
}