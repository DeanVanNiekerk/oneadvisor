using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{

    public class LookupServiceTest
    {
        #region Contact Type

        [Fact]
        public async Task GetContactTypes()
        {
            var options = TestHelper.GetDbContext("GetContactTypes");

            //Given
            var lkp1 = new ContactTypeEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new ContactTypeEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new ContactTypeEntity { Id = Guid.NewGuid(), Name = "C" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.ContactType.Add(lkp2);
                context.ContactType.Add(lkp1);
                context.ContactType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var actual = await service.GetContactTypes();

                //Then
                Assert.Equal(actual.Count, 3);

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

        #region Policy Type

        [Fact]
        public async Task GetPolicyTypes()
        {
            var options = TestHelper.GetDbContext("GetPolicyTypes");

            //Given
            var lkp1 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "C" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.PolicyType.Add(lkp2);
                context.PolicyType.Add(lkp1);
                context.PolicyType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var actual = await service.GetPolicyTypes();

                //Then
                Assert.Equal(actual.Count, 3);

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

        #region Marrial Status

        [Fact]
        public async Task GetMarrialStatus()
        {
            var options = TestHelper.GetDbContext("GetMarrialStatus");

            //Given
            var lkp1 = new MarritalStatusEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new MarritalStatusEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new MarritalStatusEntity { Id = Guid.NewGuid(), Name = "C" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.MarritalStatus.Add(lkp2);
                context.MarritalStatus.Add(lkp1);
                context.MarritalStatus.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var actual = await service.GetMarritalStatus();

                //Then
                Assert.Equal(actual.Count, 3);

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

        #region Company

        [Fact]
        public async Task GetCompanies()
        {
            var options = TestHelper.GetDbContext("GetCompanies");

            //Given
            var lkp1 = new CompanyEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new CompanyEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new CompanyEntity { Id = Guid.NewGuid(), Name = "C" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.Company.Add(lkp2);
                context.Company.Add(lkp1);
                context.Company.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var actual = await service.GetCompanies();

                //Then
                Assert.Equal(actual.Count, 3);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertCompany()
        {
            var options = TestHelper.GetDbContext("InsertCompany");

            //Given
            var model = new Company()
            {
                Name = "1"
            };

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var result = await service.InsertCompany(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.Company.FindAsync(((Company)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
            }
        }

        [Fact]
        public async Task UpdateCompany()
        {
            var options = TestHelper.GetDbContext("UpdateCompany");

            //Given
            var lkp1 = new CompanyEntity { Id = Guid.NewGuid(), Name = "1" };

            using (var context = new DataContext(options))
            {
                context.Company.Add(lkp1);

                context.SaveChanges();
            }

            var model = new Company()
            {
                Id = lkp1.Id,
                Name = "1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var result = await service.UpdateCompany(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.Company.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
            }
        }

        #endregion


        #region Commission Type

        [Fact]
        public async Task GetCommissionTypes()
        {
            var options = TestHelper.GetDbContext("GetCommissionTypes");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", PolicyTypeId = Guid.NewGuid() };
            var lkp2 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", PolicyTypeId = Guid.NewGuid() };
            var lkp3 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc", PolicyTypeId = Guid.NewGuid() };

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
                var service = new LookupService(context);

                //When
                var actual = await service.GetCommissionTypes();

                //Then
                Assert.Equal(actual.Count, 3);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.Code, actual1.Code);
                Assert.Equal(lkp1.PolicyTypeId, actual1.PolicyTypeId);

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
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", PolicyTypeId = Guid.NewGuid() };
            var lkp2 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", PolicyTypeId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.CommissionType.Add(lkp2);
                context.CommissionType.Add(lkp1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var actual = await service.GetCommissionType("Aa");

                //Then
                Assert.NotNull(actual);
                Assert.Equal(lkp1.Id, actual.Id);
                Assert.Equal(lkp1.Name, actual.Name);
                Assert.Equal(lkp1.Code, actual.Code);
                Assert.Equal(lkp1.PolicyTypeId, actual.PolicyTypeId);
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
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var result = await service.InsertCommissionType(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionType.FindAsync(((CommissionType)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
            }
        }

        [Fact]
        public async Task UpdateCommissionType()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionType");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "1", Code = "aa", PolicyTypeId = Guid.NewGuid() };

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
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var result = await service.UpdateCommissionType(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionType.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
            }
        }

        #endregion

    }
}