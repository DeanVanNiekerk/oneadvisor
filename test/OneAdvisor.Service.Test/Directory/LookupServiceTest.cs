using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Service.Directory;

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

        #region Advice Scope

        [Fact]
        public async Task GetAdviceScopes()
        {
            var options = TestHelper.GetDbContext("GetAdviceScopes");

            //Given
            var lkp1 = new AdviceScopeEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new AdviceScopeEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new AdviceScopeEntity { Id = Guid.NewGuid(), Name = "C" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.AdviceScope.Add(lkp2);
                context.AdviceScope.Add(lkp1);
                context.AdviceScope.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetAdviceScopes();

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

        [Fact]
        public async Task InsertAdviceScope()
        {
            var options = TestHelper.GetDbContext("InsertAdviceScope");

            //Given
            var model = new AdviceScope()
            {
                Name = "1",
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.InsertAdviceScope(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.AdviceScope.FindAsync(((AdviceScope)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
            }
        }

        [Fact]
        public async Task UpdateAdviceScope()
        {
            var options = TestHelper.GetDbContext("UpdateAdviceScope");

            //Given
            var lkp1 = new AdviceScopeEntity { Id = Guid.NewGuid(), Name = "1" };

            using (var context = new DataContext(options))
            {
                context.AdviceScope.Add(lkp1);

                context.SaveChanges();
            }

            var model = new AdviceScope()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.UpdateAdviceScope(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.AdviceScope.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
            }
        }

        #endregion

        #region Advice Service

        [Fact]
        public async Task GetAdviceServices()
        {
            var options = TestHelper.GetDbContext("GetAdviceServices");

            //Given
            var lkp1 = new AdviceServiceEntity { Id = Guid.NewGuid(), Name = "C", DisplayOrder = 1 };
            var lkp2 = new AdviceServiceEntity { Id = Guid.NewGuid(), Name = "B", DisplayOrder = 2 };
            var lkp3 = new AdviceServiceEntity { Id = Guid.NewGuid(), Name = "A", DisplayOrder = 3 };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.AdviceService.Add(lkp2);
                context.AdviceService.Add(lkp1);
                context.AdviceService.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetAdviceServices();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.DisplayOrder, actual1.DisplayOrder);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertAdviceService()
        {
            var options = TestHelper.GetDbContext("InsertAdviceService");

            //Given
            var model = new AdviceService()
            {
                Name = "1",
                DisplayOrder = 1
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.InsertAdviceService(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.AdviceService.FindAsync(((AdviceService)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.DisplayOrder, actual.DisplayOrder);
            }
        }

        [Fact]
        public async Task UpdateAdviceService()
        {
            var options = TestHelper.GetDbContext("UpdateAdviceService");

            //Given
            var lkp1 = new AdviceServiceEntity { Id = Guid.NewGuid(), Name = "1", DisplayOrder = 1 };

            using (var context = new DataContext(options))
            {
                context.AdviceService.Add(lkp1);

                context.SaveChanges();
            }

            var model = new AdviceService()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                DisplayOrder = 2
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.UpdateAdviceService(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.AdviceService.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.DisplayOrder, actual.DisplayOrder);
            }
        }

        #endregion

        #region License Categoriy Service

        [Fact]
        public async Task GetLicenseCategories()
        {
            var options = TestHelper.GetDbContext("GetLicenseCategories");

            //Given
            var lkp1 = new LicenseCategoryEntity { Id = Guid.NewGuid(), Name = "A", Code = "1.0" };
            var lkp2 = new LicenseCategoryEntity { Id = Guid.NewGuid(), Name = "B", Code = "2.0" };
            var lkp3 = new LicenseCategoryEntity { Id = Guid.NewGuid(), Name = "C", Code = "3.0" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.LicenseCategory.Add(lkp2);
                context.LicenseCategory.Add(lkp1);
                context.LicenseCategory.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetLicenseCategories();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.Code, actual1.Code);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertLicenseCategory()
        {
            var options = TestHelper.GetDbContext("InsertLicenseCategory");

            //Given
            var model = new LicenseCategory()
            {
                Name = "1",
                Code = "A",
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.InsertLicenseCategory(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.LicenseCategory.FindAsync(((LicenseCategory)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
            }
        }

        [Fact]
        public async Task UpdateLicenseCategory()
        {
            var options = TestHelper.GetDbContext("UpdateLicenseCategory");

            //Given
            var lkp1 = new LicenseCategoryEntity { Id = Guid.NewGuid(), Name = "1", Code = "A" };

            using (var context = new DataContext(options))
            {
                context.LicenseCategory.Add(lkp1);

                context.SaveChanges();
            }

            var model = new LicenseCategory()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                Code = "A Updated",
            };

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var result = await service.UpdateLicenseCategory(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.LicenseCategory.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
            }
        }

        #endregion

        #region User Type

        [Fact]
        public async Task GetUserTypes()
        {
            var options = TestHelper.GetDbContext("GetUserTypes");

            //Given
            var lkp1 = new UserTypeEntity { Id = Guid.NewGuid(), Name = "A", DisplayOrder = 1 };
            var lkp2 = new UserTypeEntity { Id = Guid.NewGuid(), Name = "B", DisplayOrder = 2 };
            var lkp3 = new UserTypeEntity { Id = Guid.NewGuid(), Name = "C", DisplayOrder = 3 };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.UserType.Add(lkp2);
                context.UserType.Add(lkp1);
                context.UserType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetUserTypes();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.DisplayOrder, actual1.DisplayOrder);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        #endregion

        #region VAT Rate

        [Fact]
        public async Task GetVATRate()
        {
            var options = TestHelper.GetDbContext("GetVATRate");

            //Given
            var lkp1 = new VATRateEntity { Id = Guid.NewGuid(), Rate = 14m, EndDate = new DateTime(2018, 4, 1).AddSeconds(-1) };
            var lkp2 = new VATRateEntity { Id = Guid.NewGuid(), Rate = 15m, StartDate = new DateTime(2018, 4, 1) };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.VATRate.Add(lkp2);
                context.VATRate.Add(lkp1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new DirectoryLookupService(context);

                //When
                var actual = await service.GetVATRate(new DateTime(2018, 4, 1));

                //Then
                Assert.Equal(15m, actual);

                //When
                actual = await service.GetVATRate(new DateTime(2018, 3, 31));

                //Then
                Assert.Equal(14m, actual);
            }
        }

        #endregion
    }
}