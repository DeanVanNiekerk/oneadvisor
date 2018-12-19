using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Branch;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class BranchServiceTest
    {

        [TestMethod]
        public async Task GetBranches_None()
        {
            var options = TestHelper.GetDbContext("GetBranches_None");

            //Given
            //Nothing

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var queryOptions = new BranchQueryOptions();
                var actual = await service.GetBranches(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 0);
                Assert.AreEqual(actual.Items.Count(), 0);
            }
        }

        [TestMethod]
        public async Task GetBranches_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetBranches_FilterAndSort");

            //Given
            var orgId1 = Guid.NewGuid();
            var orgId2 = Guid.NewGuid();
            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId1, Name = "A Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId2, Name = "B Branch 2" };
            var branch3 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId1, Name = "C Branch 3" };
            var branch4 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId2, Name = "D Branch 4" };
            var branch5 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId1, Name = "E Branch 5" };
            var branch6 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId1, Name = "F Branch 6" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.Branch.Add(branch6);
                context.Branch.Add(branch1);
                context.Branch.Add(branch2);
                context.Branch.Add(branch4);
                context.Branch.Add(branch5);
                context.Branch.Add(branch3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var queryOptions = new BranchQueryOptions($"organisationId={orgId1.ToString()}");
                var actual = await service.GetBranches(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 6);

                var branches = actual.Items.ToArray();

                Assert.AreEqual(branches.Count(), 4);

                var actual1 = branches[0];
                Assert.AreEqual(branch1.Id, actual1.Id);
                Assert.AreEqual(branch1.Name, actual1.Name);

                var actual2 = branches[1];
                Assert.AreEqual(branch3.Id, actual2.Id);
                Assert.AreEqual(branch3.Name, actual2.Name);

                var actual6 = branches[3];
                Assert.AreEqual(branch6.Id, actual6.Id);
                Assert.AreEqual(branch6.Name, actual6.Name);
            }
        }

        [TestMethod]
        public async Task InsertBranch()
        {
            var options = TestHelper.GetDbContext("InsertBranch");

            //Given
            var branch = new Branch()
            {
                OrganisationId = Guid.NewGuid(),
                Name = "Branch 1"
            };

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var result = await service.InsertBranch(branch);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Branch.FindAsync(((Branch)result.Tag).Id);
                Assert.AreEqual(branch.OrganisationId, actual.OrganisationId);
                Assert.AreEqual(branch.Name, actual.Name);
            }
        }

        [TestMethod]
        public async Task UpdateBranch()
        {
            var options = TestHelper.GetDbContext("UpdateBranch");

            //Given
            var branch1 = new BranchEntity { Id = Guid.NewGuid(), Name = "Branch 1", OrganisationId = Guid.NewGuid() };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), Name = "Branch 2", OrganisationId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.SaveChanges();
            }

            var branch = new Branch()
            {
                Id = branch2.Id,
                OrganisationId = branch2.OrganisationId,
                Name = "Branch 1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var result = await service.UpdateBranch(branch);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Branch.FindAsync(branch.Id);
                Assert.AreEqual(branch2.OrganisationId, actual.OrganisationId);
                Assert.AreEqual(branch.Name, actual.Name);
            }
        }

    }
}