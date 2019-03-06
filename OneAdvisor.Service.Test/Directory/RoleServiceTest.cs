using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Service.Directory;

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
                Assert.Equal(list.Count, 2);

                var actual1 = list[0];
                Assert.Equal(actual1.Id, role1.Id);
                Assert.Equal(actual1.Name, role1.Name);
                Assert.Equal(actual1.Description, role1.Description);
                Assert.Equal(actual1.ApplicationId, role1.ApplicationId);

                var actual2 = list[1];
                Assert.Equal(actual2.Id, role2.Id);
                Assert.Equal(actual2.Name, role2.Name);
                Assert.Equal(actual2.Description, role2.Description);
                Assert.Equal(actual2.ApplicationId, role2.ApplicationId);

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
                Assert.Equal(actual.Id, role1.Id);
                Assert.Equal(actual.Name, role1.Name);
                Assert.Equal(actual.Description, role1.Description);
                Assert.Equal(actual.ApplicationId, role1.ApplicationId);
                Assert.Equal(actual.UseCaseIds.Count(), 2);
                Assert.Equal(actual.UseCaseIds.ToArray()[0], "uc1");
                Assert.Equal(actual.UseCaseIds.ToArray()[1], "uc2");

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

    }
}