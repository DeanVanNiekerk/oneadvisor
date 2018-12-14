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
    public class UseCaseServiceTest
    {
        [TestMethod]
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
                Assert.AreEqual(list.Count, 2);

                var actual1 = list[0];
                Assert.AreEqual(actual1.Id, uc1.Id);
                Assert.AreEqual(actual1.Name, uc1.Name);
                Assert.AreEqual(actual1.ApplicationId, uc1.ApplicationId);

                var actual2 = list[1];
                Assert.AreEqual(actual2.Id, uc2.Id);
                Assert.AreEqual(actual2.Name, uc2.Name);
                Assert.AreEqual(actual2.ApplicationId, uc2.ApplicationId);

            }
        }

        [TestMethod]
        public async Task GetUseCases_ForRoles()
        {
            var options = TestHelper.GetDbContext("GetUseCases_ForRoles");

            //Given
            var uc1 = new UseCaseEntity { Id = "uc_1", Name = "UseCase 1", ApplicationId = Guid.NewGuid() };
            var uc2 = new UseCaseEntity { Id = "uc_2", Name = "UseCase 2", ApplicationId = Guid.NewGuid() };
            var uc3 = new UseCaseEntity { Id = "uc_3", Name = "UseCase 3", ApplicationId = Guid.NewGuid() };
            var uc4 = new UseCaseEntity { Id = "uc_4", Name = "UseCase 4", ApplicationId = Guid.NewGuid() };

            var rtuc1 = new RoleToUseCaseEntity { UseCaseId = "uc_1", RoleId = "role_1" };
            var rtuc2 = new RoleToUseCaseEntity { UseCaseId = "uc_2", RoleId = "role_2" };
            var rtuc3 = new RoleToUseCaseEntity { UseCaseId = "uc_3", RoleId = "role_3" };
            var rtuc4 = new RoleToUseCaseEntity { UseCaseId = "uc_1", RoleId = "role_3" };
            var rtuc5 = new RoleToUseCaseEntity { UseCaseId = "uc_4", RoleId = "role_2" };

            using (var context = new DataContext(options))
            {
                context.UseCase.Add(uc1);
                context.UseCase.Add(uc2);
                context.UseCase.Add(uc3);
                context.UseCase.Add(uc4);

                context.RoleToUseCase.Add(rtuc1);
                context.RoleToUseCase.Add(rtuc2);
                context.RoleToUseCase.Add(rtuc3);
                context.RoleToUseCase.Add(rtuc4);
                context.RoleToUseCase.Add(rtuc5);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new UseCaseService(context);

                //When
                var list = await service.GetUseCases(new List<string>() { "role_1", "role_3" });

                //Then
                Assert.AreEqual(list.Count, 2);

                var actual1 = list[0];
                Assert.AreEqual(actual1, uc1.Id);

                var actual2 = list[1];
                Assert.AreEqual(actual2, uc3.Id);

            }
        }

    }
}