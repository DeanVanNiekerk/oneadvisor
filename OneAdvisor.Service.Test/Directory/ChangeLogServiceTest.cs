using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Service.Directory;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.ChangeLog;

namespace OneAdvisor.Service.Test.Directory
{

    public class ChangeLogServiceTest
    {
        [Fact]
        public async Task GetChangeLogs()
        {
            var options = TestHelper.GetDbContext("GetChangeLogs");

            var now = DateTime.Now;

            //Given
            var cl1 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "1.0", ReleaseDate = now.AddMonths(-2), Published = true, Log = "Log 1" };
            var cl2 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "2.0", ReleaseDate = now.AddMonths(-1), Published = true, Log = "Log 2" };
            var cl3 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "3.0", ReleaseDate = now, Published = true, Log = "Log 3" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.ChangeLog.Add(cl1);
                context.ChangeLog.Add(cl3);
                context.ChangeLog.Add(cl2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ChangeLogService(context);

                //When
                var queryOptions = new ChangeLogQueryOptions("", "", 0, 0);
                var actual = await service.GetChangeLogs(queryOptions);

                //Then
                Assert.Equal(3, actual.TotalItems);
                Assert.Equal(3, actual.Items.Count());

                var items = actual.Items.ToList();

                var actual1 = items[0];
                Assert.Equal(cl3.Id, actual1.Id);
                Assert.Equal(cl3.VersionNumber, actual1.VersionNumber);
                Assert.Equal(cl3.ReleaseDate, actual1.ReleaseDate);
                Assert.Equal(cl3.Published, actual1.Published);
                Assert.Equal(cl3.Log, actual1.Log);

                var actual2 = items[1];
                Assert.Equal(cl2.Id, actual2.Id);

                var actual3 = items[2];
                Assert.Equal(cl1.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task GetLatestChangeLog()
        {
            var options = TestHelper.GetDbContext("GetLatestChangeLog");

            var now = DateTime.Now;

            //Given
            var cl1 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "1.0", ReleaseDate = now.AddMonths(-2), Published = true, Log = "Log 1" };
            var cl2 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "2.0", ReleaseDate = now.AddMonths(-1), Published = true, Log = "Log 2" };
            var cl3 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "3.0", ReleaseDate = now, Published = false, Log = "Log 3" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.ChangeLog.Add(cl1);
                context.ChangeLog.Add(cl3);
                context.ChangeLog.Add(cl2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ChangeLogService(context);

                //When
                var actual = await service.GetLatestChangeLog();

                //Then
                Assert.Equal(cl2.Id, actual.Id);
                Assert.Equal(cl2.VersionNumber, actual.VersionNumber);
                Assert.Equal(cl2.ReleaseDate, actual.ReleaseDate);
                Assert.Equal(cl2.Published, actual.Published);
                Assert.Equal(cl2.Log, actual.Log);
            }
        }

        [Fact]
        public async Task InsertChangeLog()
        {
            var options = TestHelper.GetDbContext("InsertChangeLog");

            //Given
            var model = new ChangeLog()
            {
                VersionNumber = "1.0",
                ReleaseDate = DateTime.Now.AddMonths(-2),
                Log = "Log 1",
                Published = true
            };

            using (var context = new DataContext(options))
            {
                var service = new ChangeLogService(context);

                //When
                var result = await service.InsertChangeLog(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.ChangeLog.FindAsync(((ChangeLog)result.Tag).Id);
                Assert.Equal(model.VersionNumber, actual.VersionNumber);
                Assert.Equal(model.ReleaseDate, actual.ReleaseDate);
                Assert.Equal(model.Published, actual.Published);
                Assert.Equal(model.Log, actual.Log);
            }
        }

        [Fact]
        public async Task UpdateChangeLog()
        {
            var options = TestHelper.GetDbContext("UpdateChangeLog");

            //Given
            var cl1 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "1.0", ReleaseDate = DateTime.Now.AddMonths(-2), Published = false, Log = "Log 1" };
            var cl2 = new ChangeLogEntity { Id = Guid.NewGuid(), VersionNumber = "2.0", ReleaseDate = DateTime.Now.AddMonths(-1), Published = false, Log = "Log 2" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.ChangeLog.Add(cl1);
                context.ChangeLog.Add(cl2);

                context.SaveChanges();
            }

            var model = new ChangeLog()
            {
                Id = cl2.Id,
                VersionNumber = "2.1",
                ReleaseDate = DateTime.Now.AddMonths(-3),
                Log = "Log 2 updated",
                Published = true
            };

            using (var context = new DataContext(options))
            {
                var service = new ChangeLogService(context);

                //When
                var result = await service.UpdateChangeLog(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.ChangeLog.FindAsync(model.Id);
                Assert.Equal(model.VersionNumber, actual.VersionNumber);
                Assert.Equal(model.ReleaseDate, actual.ReleaseDate);
                Assert.Equal(model.Published, actual.Published);
                Assert.Equal(model.Log, actual.Log);
            }
        }
    }
}