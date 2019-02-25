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
    public class UserServiceTest
    {
        // [TestMethod]
        // public async Task GetUsers()
        // {
        //     var options = TestHelper.GetDbContext("GetUsers");

        //     var u1 = new UserEntity() { Id = Guid.NewGuid() };

        //     using (var context = new DataContext(options))
        //     {
        //         context.Users.Add(u1);

        //         context.SaveChanges();
        //     }

        //     using (var context = new DataContext(options))
        //     {
        //         var service = new UseCaseService(context);

        //         //When
        //         var list = await service.GetUseCases();

        //         //Then
        //         Assert.AreEqual(list.Count, 2);

        //         var actual1 = list[0];
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Name, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);
        //         Assert.AreEqual(actual1.Id, u1.Id);

        //         var actual2 = list[1];
        //         //Assert.AreEqual(actual2.Id, uc2.Id);
        //     }
        // }
    }
}