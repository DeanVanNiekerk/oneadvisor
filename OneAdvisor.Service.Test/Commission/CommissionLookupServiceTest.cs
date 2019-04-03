using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Service.Commission;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionLookupServiceTest
    {
        #region Commission Type

        [Fact]
        public async Task GetCommissionTypes()
        {
            var options = TestHelper.GetDbContext("GetCommissionTypes");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", PolicyTypeId = Guid.NewGuid(), CommissionEarningsTypeId = Guid.NewGuid() };
            var lkp2 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", PolicyTypeId = Guid.NewGuid(), CommissionEarningsTypeId = Guid.NewGuid() };
            var lkp3 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc", PolicyTypeId = Guid.NewGuid(), CommissionEarningsTypeId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.CommissionType.Add(lkp2);
                context.CommissionType.Add(lkp1);
                context.CommissionType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionLookupService(context);

                //When
                var actual = await service.GetCommissionTypes();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.Code, actual1.Code);
                Assert.Equal(lkp1.PolicyTypeId, actual1.PolicyTypeId);
                Assert.Equal(lkp1.CommissionEarningsTypeId, actual1.CommissionEarningsTypeId);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task GetCommissionType()
        {
            var options = TestHelper.GetDbContext("GetCommissionType");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", PolicyTypeId = Guid.NewGuid(), CommissionEarningsTypeId = Guid.NewGuid() };
            var lkp2 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", PolicyTypeId = Guid.NewGuid(), CommissionEarningsTypeId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.CommissionType.Add(lkp2);
                context.CommissionType.Add(lkp1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionLookupService(context);

                //When
                var actual = await service.GetCommissionType("Aa");

                //Then
                Assert.NotNull(actual);
                Assert.Equal(lkp1.Id, actual.Id);
                Assert.Equal(lkp1.Name, actual.Name);
                Assert.Equal(lkp1.Code, actual.Code);
                Assert.Equal(lkp1.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(lkp1.CommissionEarningsTypeId, actual.CommissionEarningsTypeId);
            }
        }

        [Fact]
        public async Task InsertCommissionType()
        {
            var options = TestHelper.GetDbContext("InsertCommissionType");

            //Given
            var model = new CommissionType()
            {
                Name = "1",
                Code = "one",
                PolicyTypeId = Guid.NewGuid(),
                CommissionEarningsTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionLookupService(context);

                //When
                var result = await service.InsertCommissionType(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionType.FindAsync(((CommissionType)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(model.CommissionEarningsTypeId, actual.CommissionEarningsTypeId);
            }
        }

        [Fact]
        public async Task UpdateCommissionType()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionType");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "1", Code = "aa", PolicyTypeId = Guid.NewGuid(), CommissionEarningsTypeId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(lkp1);

                context.SaveChanges();
            }

            var model = new CommissionType()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                Code = "aa Updated",
                PolicyTypeId = Guid.NewGuid(),
                CommissionEarningsTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionLookupService(context);

                //When
                var result = await service.UpdateCommissionType(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionType.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(model.CommissionEarningsTypeId, actual.CommissionEarningsTypeId);
            }
        }

        #endregion

        #region Marrial Status

        [Fact]
        public async Task GetCommissionEarningsTypes()
        {
            var options = TestHelper.GetDbContext("GetCommissionEarningsTypes");

            //Given
            var lkp1 = new CommissionEarningsTypeEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new CommissionEarningsTypeEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new CommissionEarningsTypeEntity { Id = Guid.NewGuid(), Name = "C" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.CommissionEarningsType.Add(lkp2);
                context.CommissionEarningsType.Add(lkp1);
                context.CommissionEarningsType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionLookupService(context);

                //When
                var actual = await service.GetCommissionEarningsTypes();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        #endregion

    }
}