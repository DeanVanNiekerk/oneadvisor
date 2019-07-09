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
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Service.Test.Directory
{

    public class LookupServiceTest
    {
        #region Company

        [Fact]
        public async Task GetCompanies()
        {
            var options = TestHelper.GetDbContext("GetCompanies");

            //Given
            var lkp1 = new CompanyEntity { Id = Guid.NewGuid(), Name = "A", CommissionPolicyNumberPrefixes = new List<string>() { "pre_1" } };
            var lkp2 = new CompanyEntity { Id = Guid.NewGuid(), Name = "B", CommissionPolicyNumberPrefixes = new List<string>() { "pre_2" } };
            var lkp3 = new CompanyEntity { Id = Guid.NewGuid(), Name = "C", CommissionPolicyNumberPrefixes = new List<string>() { "pre_3" } };

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
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetCompanies();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.CommissionPolicyNumberPrefixes, actual1.CommissionPolicyNumberPrefixes);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task GetCompany()
        {
            var options = TestHelper.GetDbContext("GetCompany");

            //Given
            var lkp1 = new CompanyEntity { Id = Guid.NewGuid(), Name = "A", CommissionPolicyNumberPrefixes = new List<string>() { "pre_1" } };
            var lkp2 = new CompanyEntity { Id = Guid.NewGuid(), Name = "B", CommissionPolicyNumberPrefixes = new List<string>() { "pre_2" } };

            using (var context = new DataContext(options))
            {
                context.Company.Add(lkp1);
                context.Company.Add(lkp2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetCompany(lkp2.Id);

                //Then
                Assert.Equal(lkp2.Id, actual.Id);
                Assert.Equal(lkp2.Name, actual.Name);
                Assert.Equal(lkp2.CommissionPolicyNumberPrefixes, actual.CommissionPolicyNumberPrefixes);
            }
        }

        [Fact]
        public async Task InsertCompany()
        {
            var options = TestHelper.GetDbContext("InsertCompany");

            //Given
            var model = new Company()
            {
                Name = "1",
                CommissionPolicyNumberPrefixes = new List<string>() { "pre_1" }
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.InsertCompany(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.Company.FindAsync(((Company)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.CommissionPolicyNumberPrefixes, actual.CommissionPolicyNumberPrefixes);
            }
        }

        [Fact]
        public async Task UpdateCompany()
        {
            var options = TestHelper.GetDbContext("UpdateCompany");

            //Given
            var lkp1 = new CompanyEntity { Id = Guid.NewGuid(), Name = "1", CommissionPolicyNumberPrefixes = new List<string>() { "pre_1" } };

            using (var context = new DataContext(options))
            {
                context.Company.Add(lkp1);

                context.SaveChanges();
            }

            var model = new Company()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                CommissionPolicyNumberPrefixes = new List<string>() { "pre_1", "pre_new" }
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.UpdateCompany(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.Company.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.CommissionPolicyNumberPrefixes, actual.CommissionPolicyNumberPrefixes);
            }
        }

        #endregion
    }
}