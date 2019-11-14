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

    public class UseCaseServiceTest
    {
        [Fact]
        public async Task GetUseCases()
        {
            var options = TestHelper.GetDbContext("GetUseCases");

            //Given
            var uc1 = new UseCaseEntity { Id = "uc_1", Name = "UseCase 1", ApplicationId = Guid.NewGuid() };
            var uc2 = new UseCaseEntity { Id = "uc_2", Name = "UseCase 2", ApplicationId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.UseCase.Add(uc1);
                context.UseCase.Add(uc2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new UseCaseService(context);

                //When
                var list = await service.GetUseCases();

                //Then
                Assert.Equal(2, list.Count);

                var actual1 = list[0];
                Assert.Equal(actual1.Id, uc1.Id);
                Assert.Equal(actual1.Name, uc1.Name);
                Assert.Equal(actual1.ApplicationId, uc1.ApplicationId);

                var actual2 = list[1];
                Assert.Equal(actual2.Id, uc2.Id);
                Assert.Equal(actual2.Name, uc2.Name);
                Assert.Equal(actual2.ApplicationId, uc2.ApplicationId);

            }
        }

        [Fact]
        public async Task GetUseCases_ForRoles()
        {
            var options = TestHelper.GetDbContext("GetUseCases_ForRoles");

            //Given
            var uc1 = new UseCaseEntity { Id = "uc_1", Name = "UseCase 1", ApplicationId = Guid.NewGuid() };
            var uc2 = new UseCaseEntity { Id = "uc_2", Name = "UseCase 2", ApplicationId = Guid.NewGuid() };
            var uc3 = new UseCaseEntity { Id = "uc_3", Name = "UseCase 3", ApplicationId = Guid.NewGuid() };
            var uc4 = new UseCaseEntity { Id = "uc_4", Name = "UseCase 4", ApplicationId = Guid.NewGuid() };

            var role1 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_1", Description = "Role 1", ApplicationId = Guid.NewGuid() };
            var role2 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_2", Description = "Role 2", ApplicationId = Guid.NewGuid() };
            var role3 = new RoleEntity { Id = Guid.NewGuid(), Name = "role_3", Description = "Role 3", ApplicationId = Guid.NewGuid() };

            var rtuc1 = new RoleToUseCaseEntity { UseCaseId = "uc_1", RoleId = role1.Id };
            var rtuc2 = new RoleToUseCaseEntity { UseCaseId = "uc_2", RoleId = role2.Id };
            var rtuc3 = new RoleToUseCaseEntity { UseCaseId = "uc_3", RoleId = role3.Id };
            var rtuc4 = new RoleToUseCaseEntity { UseCaseId = "uc_1", RoleId = role3.Id };
            var rtuc5 = new RoleToUseCaseEntity { UseCaseId = "uc_4", RoleId = role2.Id };

            using (var context = new DataContext(options))
            {
                context.UseCase.Add(uc1);
                context.UseCase.Add(uc3);
                context.UseCase.Add(uc2);
                context.UseCase.Add(uc4);

                context.Roles.Add(role1);
                context.Roles.Add(role3);
                context.Roles.Add(role2);

                context.RoleToUseCase.Add(rtuc1);
                context.RoleToUseCase.Add(rtuc3);
                context.RoleToUseCase.Add(rtuc2);
                context.RoleToUseCase.Add(rtuc5);
                context.RoleToUseCase.Add(rtuc4);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new UseCaseService(context);

                //When
                var list = await service.GetUseCases(new List<string>() { "role_1", "role_3" });

                //Then
                Assert.Equal(2, list.Count);

                var actual1 = list[0];
                Assert.Equal(uc1.Id, actual1);

                var actual2 = list[1];
                Assert.Equal(uc3.Id, actual2);

            }
        }

    }
}