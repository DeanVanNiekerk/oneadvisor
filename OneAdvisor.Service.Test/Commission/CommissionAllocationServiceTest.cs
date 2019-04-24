using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data;
using OneAdvisor.Service.Commission;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionAllocationServiceTest
    {
        [Fact]
        public async Task GetCommissionAllocations()
        {
            var options = TestHelper.GetDbContext("GetCommissionAllocations");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client3 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);
            var client4 = TestHelper.InsertClient(options, user2.Organisation);
            var client5 = TestHelper.InsertClient(options, user2.Organisation);

            var ca1 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client2.Client.Id,
            };

            var ca2 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client3.Client.Id,
            };

            var ca3 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client4.Client.Id,
                ToClientId = client5.Client.Id,
            };

            using (var context = new DataContext(options))
            {
                context.CommissionAllocation.Add(ca1);
                context.CommissionAllocation.Add(ca3);
                context.CommissionAllocation.Add(ca2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionAllocationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionAllocationQueryOptions(scope, "", "", 0, 0);
                var allocations = await service.GetCommissionAllocations(queryOptions);

                //Then
                Assert.Equal(2, allocations.TotalItems);
                Assert.Equal(2, allocations.Items.Count());

                var items = allocations.Items.ToList();
                var actual = items[0];
                Assert.Equal(ca1.Id, actual.Id);
                Assert.Equal(ca1.FromClientId, actual.FromClientId);
                Assert.Equal(ca1.ToClientId, actual.ToClientId);

                actual = items[1];
                Assert.Equal(ca2.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                queryOptions = new CommissionAllocationQueryOptions(scope, "", "", 0, 0);
                allocations = await service.GetCommissionAllocations(queryOptions);

                Assert.Single(allocations.Items);

                actual = allocations.Items.First();
                Assert.Equal(ca3.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetCommissionAllocation()
        {
            var options = TestHelper.GetDbContext("GetCommissionAllocation");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client3 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var ca1 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client2.Client.Id,
            };

            var ca2 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client3.Client.Id,
            };

            using (var context = new DataContext(options))
            {
                context.CommissionAllocation.Add(ca1);
                context.CommissionAllocation.Add(ca2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionAllocationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var allocation = await service.GetCommissionAllocation(scope, ca2.Id);

                //Then
                Assert.Equal(ca2.Id, allocation.Id);
                Assert.Equal(ca2.FromClientId, allocation.FromClientId);
                Assert.Equal(ca2.ToClientId, allocation.ToClientId);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                allocation = await service.GetCommissionAllocation(scope, ca2.Id);
                Assert.Null(allocation);
            }
        }

        [Fact]
        public async Task InsertCommissionAllocation()
        {
            var options = TestHelper.GetDbContext("InsertCommissionAllocation");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var ca1 = new CommissionAllocationEdit
                {
                    FromClientId = client1.Client.Id,
                    ToClientId = client2.Client.Id,
                };

                var service = new CommissionAllocationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertCommissionAllocation(scope, ca1);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionAllocation.FindAsync(((CommissionAllocationEdit)result.Tag).Id);
                Assert.Equal(ca1.Id, actual.Id);
                Assert.Equal(ca1.FromClientId, actual.FromClientId);
                Assert.Equal(ca1.ToClientId, actual.ToClientId);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.InsertCommissionAllocation(scope, ca1);
                Assert.False(result.Success);
                Assert.Equal("Client does not exist", result.ValidationFailures.Single().ErrorMessage);
            }
        }

        [Fact]
        public async Task UpdateCommissionAllocation()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionAllocation");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client3 = TestHelper.InsertClient(options, user1.Organisation);
            var client4 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var ca1 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client2.Client.Id,
            };

            var ca2 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client3.Client.Id,
            };

            using (var context = new DataContext(options))
            {
                context.CommissionAllocation.Add(ca1);
                context.CommissionAllocation.Add(ca2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var ca2Updated = new CommissionAllocationEdit
                {
                    Id = ca2.Id,
                    FromClientId = client2.Client.Id,
                    ToClientId = client4.Client.Id,
                };

                var service = new CommissionAllocationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateCommissionAllocation(scope, ca2Updated);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionAllocation.FindAsync(ca2Updated.Id);
                Assert.Equal(ca2Updated.Id, actual.Id);
                Assert.Equal(ca2Updated.FromClientId, actual.FromClientId);
                Assert.Equal(ca2Updated.ToClientId, actual.ToClientId);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.UpdateCommissionAllocation(scope, ca2Updated);
                Assert.False(result.Success);
                Assert.Equal("Client does not exist", result.ValidationFailures.Single().ErrorMessage);
            }
        }

        [Fact]
        public async Task DeleteCommissionAllocation()
        {
            var options = TestHelper.GetDbContext("DeleteCommissionAllocation");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client3 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var ca1 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client2.Client.Id,
            };

            var ca2 = new CommissionAllocationEntity
            {
                Id = Guid.NewGuid(),
                FromClientId = client1.Client.Id,
                ToClientId = client3.Client.Id,
            };

            using (var context = new DataContext(options))
            {
                context.CommissionAllocation.Add(ca1);
                context.CommissionAllocation.Add(ca2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionAllocationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.DeleteCommissionAllocation(scope, ca2.Id);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionAllocation.FindAsync(ca2.Id);
                Assert.Null(actual);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.DeleteCommissionAllocation(scope, ca1.Id);
                Assert.False(result.Success);
                actual = await context.CommissionAllocation.FindAsync(ca1.Id);
                Assert.NotNull(actual);
            }
        }
    }
}