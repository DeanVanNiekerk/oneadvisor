using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{

    public class AuditServiceTest
    {
        [Fact]
        public async Task GetAuditLogs_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetAuditLogs_FilterAndSort");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var al1 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-1), Data = "A" };
            var al2 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-2), Data = "B" };
            var al3 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-3), Data = "C" };
            var al4 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-4), Data = "D" };
            var al5 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Update", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-5), Data = "E" };
            var al6 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-6), Data = "F" };

            var al7 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Client", Action = "Insert", UserId = user2.User.Id, Date = DateTime.Now.AddDays(-7), Data = "G" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.AuditLog.Add(al2);
                context.AuditLog.Add(al1);
                context.AuditLog.Add(al4);
                context.AuditLog.Add(al5);
                context.AuditLog.Add(al6);
                context.AuditLog.Add(al3);
                context.AuditLog.Add(al7);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new AuditService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new AuditLogQueryOptions(scope, "Date", "desc", 0, 0, $"action=Insert");
                var actual = await service.GetAuditLogs(queryOptions);

                //Then
                Assert.Equal(5, actual.TotalItems);

                var logs = actual.Items.ToArray();

                Assert.Equal(5, logs.Count());

                var actual1 = logs[0];
                Assert.Equal(al1.Id, actual1.Id);
                Assert.Equal(al1.Action, actual1.Action);
                Assert.Equal(al1.Entity, actual1.Entity);
                Assert.Equal(al1.Data, actual1.Data);
                Assert.Equal(al1.Date, actual1.Date);
                Assert.Equal(al1.UserId, actual1.UserId);

                var actual2 = logs[1];
                Assert.Equal(al2.Id, actual2.Id);

                var actual3 = logs[2];
                Assert.Equal(al3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertAuditLog()
        {
            var options = TestHelper.GetDbContext("InsertAuditLog");

            //Given
            var model = new AuditLog()
            {
                Date = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
                Action = "Action 1",
                Entity = "Entity 1",
                Data = "Data 1"
            };

            using (var context = new DataContext(options))
            {
                var service = new AuditService(context);

                //When
                var result = await service.InsertAuditLog(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.AuditLog.FindAsync(((AuditLog)result.Tag).Id);
                Assert.Equal(model.Date, actual.Date);
                Assert.Equal(model.UserId, actual.UserId);
                Assert.Equal(model.Action, actual.Action);
                Assert.Equal(model.Entity, actual.Entity);
                Assert.Equal(model.Data, actual.Data);
            }
        }
    }
}