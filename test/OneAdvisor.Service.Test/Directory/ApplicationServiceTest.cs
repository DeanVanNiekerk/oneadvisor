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

    public class ApplicationServiceTest
    {
        [Fact]
        public async Task GetApplications()
        {
            var options = TestHelper.GetDbContext("GetApplications");

            //Given
            var app1 = new ApplicationEntity { Id = Guid.NewGuid(), Name = "App 1" };
            var app2 = new ApplicationEntity { Id = Guid.NewGuid(), Name = "App 2" };

            using (var context = new DataContext(options))
            {
                context.Application.Add(app1);
                context.Application.Add(app2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ApplicationService(context);

                //When
                var list = await service.GetApplications();

                //Then
                Assert.Equal(2, list.Count);

                var actual1 = list[0];
                Assert.Equal(actual1.Id, app1.Id);
                Assert.Equal(actual1.Name, app1.Name);

                var actual2 = list[1];
                Assert.Equal(actual2.Id, app2.Id);
                Assert.Equal(actual2.Name, app2.Name);

            }
        }

    }
}