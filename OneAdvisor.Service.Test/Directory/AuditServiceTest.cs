using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class AuditServiceTest
    {
        [TestMethod]
        public async Task GetAuditLogs_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetAuditLogs_FilterAndSort");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var al1 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-1), Data = "A" };
            var al2 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-2), Data = "B" };
            var al3 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-3), Data = "C" };
            var al4 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-4), Data = "D" };
            var al5 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Update", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-5), Data = "E" };
            var al6 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Insert", UserId = user1.User.Id, Date = DateTime.Now.AddDays(-6), Data = "F" };

            var al7 = new AuditLogEntity { Id = Guid.NewGuid(), Entity = "Member", Action = "Insert", UserId = user2.User.Id, Date = DateTime.Now.AddDays(-7), Data = "G" };

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
                Assert.AreEqual(actual.TotalItems, 5);

                var logs = actual.Items.ToArray();

                Assert.AreEqual(logs.Count(), 5);

                var actual1 = logs[0];
                Assert.AreEqual(al1.Id, actual1.Id);
                Assert.AreEqual(al1.Action, actual1.Action);
                Assert.AreEqual(al1.Entity, actual1.Entity);
                Assert.AreEqual(al1.Data, actual1.Data);
                Assert.AreEqual(al1.Date, actual1.Date);
                Assert.AreEqual(al1.UserId, actual1.UserId);

                var actual2 = logs[1];
                Assert.AreEqual(al2.Id, actual2.Id);

                var actual3 = logs[2];
                Assert.AreEqual(al3.Id, actual3.Id);
            }
        }
    }
}