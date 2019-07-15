using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Branch;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{

    public class BranchServiceTest
    {
        [Fact]
        public async Task GetBranches_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetBranches_FilterAndSort");

            var user1 = TestHelper.InsertUserDetailed(options);

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
                var scope = TestHelper.GetScopeOptions(user1);
                scope.IgnoreScope = true;
                var queryOptions = new BranchQueryOptions(scope, $"organisationId={orgId1.ToString()}");
                var actual = await service.GetBranches(queryOptions);

                //Then
                Assert.Equal(4, actual.TotalItems);

                var branches = actual.Items.ToArray();

                Assert.Equal(4, branches.Count());

                var actual1 = branches[0];
                Assert.Equal(branch1.Id, actual1.Id);
                Assert.Equal(branch1.Name, actual1.Name);

                var actual2 = branches[1];
                Assert.Equal(branch3.Id, actual2.Id);
                Assert.Equal(branch3.Name, actual2.Name);

                var actual6 = branches[3];
                Assert.Equal(branch6.Id, actual6.Id);
                Assert.Equal(branch6.Name, actual6.Name);
            }
        }

        [Fact]
        public async Task GetBranch()
        {
            var options = TestHelper.GetDbContext("GetBranch");

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var orgId2 = Guid.NewGuid();
            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = user1.Organisation.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = orgId2, Name = "Branch 2" };

            using (var context = new DataContext(options))
            {
                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetBranch(scope, branch1.Id);

                //Then
                Assert.Equal(branch1.Id, actual.Id);
                Assert.Equal(branch1.OrganisationId, actual.OrganisationId);
                Assert.Equal(branch1.Name, actual.Name);

                //Scope check
                scope = TestHelper.GetScopeOptions(user1);
                actual = await service.GetBranch(scope, branch2.Id);

                //Then
                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task InsertBranch()
        {
            var options = TestHelper.GetDbContext("InsertBranch");

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var branch = new Branch()
            {
                OrganisationId = user1.Organisation.Id,
                Name = "Branch 1"
            };

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertBranch(scope, branch);

                //Then
                Assert.True(result.Success);

                var actual = await context.Branch.FindAsync(((Branch)result.Tag).Id);
                Assert.Equal(branch.OrganisationId, actual.OrganisationId);
                Assert.Equal(branch.Name, actual.Name);

                //Scope check
                scope = TestHelper.GetScopeOptions(user1, Scope.Branch);
                result = await service.InsertBranch(scope, branch);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task UpdateBranch()
        {
            var options = TestHelper.GetDbContext("UpdateBranch");

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var branch1 = new BranchEntity { Id = Guid.NewGuid(), Name = "Branch 1", OrganisationId = user1.Organisation.Id };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), Name = "Branch 2", OrganisationId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.SaveChanges();
            }

            var branch = new Branch()
            {
                Id = branch1.Id,
                OrganisationId = branch1.OrganisationId,
                Name = "Branch 1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new BranchService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateBranch(scope, branch);

                //Then
                Assert.True(result.Success);

                var actual = await context.Branch.FindAsync(branch.Id);
                Assert.Equal(branch.OrganisationId, actual.OrganisationId);
                Assert.Equal(branch.Name, actual.Name);

                //Scope check
                branch.Id = branch2.Id;
                branch.OrganisationId = branch2.OrganisationId;
                scope = TestHelper.GetScopeOptions(user1);
                result = await service.UpdateBranch(scope, branch);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task GetBranchesSimple()
        {
            var options = TestHelper.GetDbContext("GetBranchesSimple");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var orgId1 = user1.Organisation.Id;
            var orgId2 = user2.Organisation.Id;
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
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetBranchesSimple(scope);

                //Then
                var branches = actual.ToArray();

                Assert.Equal(5, branches.Count());

                var actual1 = branches.First(b => b.Id == branch1.Id);
                Assert.Equal(branch1.Name, actual1.Name);

                var actual2 = branches.First(b => b.Id == branch3.Id);
                Assert.Equal(branch3.Name, actual2.Name);

                var actual5 = branches.First(b => b.Id == branch5.Id);
                Assert.Equal(branch5.Name, actual5.Name);

                var actual6 = branches.First(b => b.Id == branch6.Id);
                Assert.Equal(branch6.Name, actual6.Name);
            }
        }

    }
}