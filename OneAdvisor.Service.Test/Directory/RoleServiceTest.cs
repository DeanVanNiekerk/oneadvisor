using System.Collections.Generic;
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
    }
}