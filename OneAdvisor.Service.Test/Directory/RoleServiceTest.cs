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
    public class RoleServiceTest
    {
        [TestMethod]
        public async Task GetRoles()
        {
            var options = TestHelper.GetDbContext("GetRoles");

            //Given
            var role1 = new RoleEntity { Id = "role_1", Name = "Role 1", ApplicationId = Guid.NewGuid() };
            var role2 = new RoleEntity { Id = "role_2", Name = "Role 2", ApplicationId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.Role.Add(role1);
                context.Role.Add(role2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var list = await service.GetRoles();

                //Then
                Assert.AreEqual(list.Count, 2);

                var actual1 = list[0];
                Assert.AreEqual(actual1.Id, role1.Id);
                Assert.AreEqual(actual1.Name, role1.Name);
                Assert.AreEqual(actual1.ApplicationId, role1.ApplicationId);

                var actual2 = list[1];
                Assert.AreEqual(actual2.Id, role2.Id);
                Assert.AreEqual(actual2.Name, role2.Name);
                Assert.AreEqual(actual2.ApplicationId, role2.ApplicationId);

            }
        }

        [TestMethod]
        public async Task GetRole()
        {
            var options = TestHelper.GetDbContext("GetRole");

            //Given
            var role1 = new RoleEntity { Id = "role_1", Name = "Role 1", ApplicationId = Guid.NewGuid() };
            var role2 = new RoleEntity { Id = "role_2", Name = "Role 2", ApplicationId = Guid.NewGuid() };
            var role3 = new RoleEntity { Id = "role_3", Name = "Role 3", ApplicationId = Guid.NewGuid() };

            var roleToUseCase1 = new RoleToUseCaseEntity { RoleId = "role_1", UseCaseId = "uc1" };
            var roleToUseCase2 = new RoleToUseCaseEntity { RoleId = "role_1", UseCaseId = "uc2" };

            var roleToUseCase3 = new RoleToUseCaseEntity { RoleId = "role_2", UseCaseId = "uc3" };

            using (var context = new DataContext(options))
            {
                context.Role.Add(role3);
                context.Role.Add(role1);
                context.Role.Add(role2);

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
                Assert.AreEqual(actual.Id, role1.Id);
                Assert.AreEqual(actual.Name, role1.Name);
                Assert.AreEqual(actual.ApplicationId, role1.ApplicationId);
                Assert.AreEqual(actual.UseCaseIds.Count(), 2);
                Assert.AreEqual(actual.UseCaseIds.ToArray()[0], "uc1");
                Assert.AreEqual(actual.UseCaseIds.ToArray()[1], "uc2");

            }
        }

        [TestMethod]
        public async Task HasUseCase_DoesNotHave()
        {
            var options = TestHelper.GetDbContext("HasUseCase_DoesNotHave");

            //Given
            var role1 = new RoleEntity { Id = "role_1" };
            var role2 = new RoleEntity { Id = "role_2" };

            var useCase = new UseCaseEntity { Id = "usecase_1" };

            var roleToUseCase = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = useCase.Id };

            using (var context = new DataContext(options))
            {
                context.Role.Add(role1);
                context.Role.Add(role2);

                context.UseCase.Add(useCase);

                context.RoleToUseCase.Add(roleToUseCase);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var actual = await service.HasUseCase(new List<string>() { role1.Id }, useCase.Id);

                //Then
                Assert.IsFalse(actual);
            }
        }

        [TestMethod]
        public async Task HasUseCase_DoesHave()
        {
            var options = TestHelper.GetDbContext("HasUseCase_DoesHave");

            //Given
            var role1 = new RoleEntity { Id = "role_1" };
            var role2 = new RoleEntity { Id = "role_2" };

            var useCase = new UseCaseEntity { Id = "usecase_1" };

            var roleToUseCase = new RoleToUseCaseEntity { RoleId = role2.Id, UseCaseId = useCase.Id };

            using (var context = new DataContext(options))
            {
                context.Role.Add(role1);
                context.Role.Add(role2);

                context.UseCase.Add(useCase);

                context.RoleToUseCase.Add(roleToUseCase);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new RoleService(context);

                //When
                var actual = await service.HasUseCase(new List<string>() { role2.Id }, useCase.Id);

                //Then
                Assert.IsTrue(actual);
            }
        }

    }
}