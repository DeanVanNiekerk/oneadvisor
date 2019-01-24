using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class LookupServiceTest
    {
        #region Contact Type

        [TestMethod]
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
                Assert.AreEqual(actual.Count, 3);

                var actual1 = actual[0];
                Assert.AreEqual(lkp1.Id, actual1.Id);
                Assert.AreEqual(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.AreEqual(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.AreEqual(lkp3.Id, actual3.Id);
            }
        }

        #endregion

        #region Policy Type

        [TestMethod]
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
                Assert.AreEqual(actual.Count, 3);

                var actual1 = actual[0];
                Assert.AreEqual(lkp1.Id, actual1.Id);
                Assert.AreEqual(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.AreEqual(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.AreEqual(lkp3.Id, actual3.Id);
            }
        }

        #endregion

        #region Marrial Status

        [TestMethod]
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
                Assert.AreEqual(actual.Count, 3);

                var actual1 = actual[0];
                Assert.AreEqual(lkp1.Id, actual1.Id);
                Assert.AreEqual(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.AreEqual(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.AreEqual(lkp3.Id, actual3.Id);
            }
        }

        #endregion

        #region Company

        [TestMethod]
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
                Assert.AreEqual(actual.Count, 3);

                var actual1 = actual[0];
                Assert.AreEqual(lkp1.Id, actual1.Id);
                Assert.AreEqual(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.AreEqual(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.AreEqual(lkp3.Id, actual3.Id);
            }
        }

        [TestMethod]
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
                Assert.IsTrue(result.Success);

                var actual = await context.Company.FindAsync(((Company)result.Tag).Id);
                Assert.AreEqual(model.Name, actual.Name);
            }
        }

        [TestMethod]
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
                Assert.IsTrue(result.Success);

                var actual = await context.Company.FindAsync(model.Id);
                Assert.AreEqual(model.Name, actual.Name);
            }
        }

        #endregion


        #region Commission Type

        [TestMethod]
        public async Task GetCommissionTypes()
        {
            var options = TestHelper.GetDbContext("GetCommissionTypes");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "A" };
            var lkp2 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "B" };
            var lkp3 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "C" };

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
                Assert.AreEqual(actual.Count, 3);

                var actual1 = actual[0];
                Assert.AreEqual(lkp1.Id, actual1.Id);
                Assert.AreEqual(lkp1.Name, actual1.Name);

                var actual2 = actual[1];
                Assert.AreEqual(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.AreEqual(lkp3.Id, actual3.Id);
            }
        }

        [TestMethod]
        public async Task InsertCommissionType()
        {
            var options = TestHelper.GetDbContext("InsertCommissionType");

            //Given
            var model = new CommissionType()
            {
                Name = "1"
            };

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var result = await service.InsertCommissionType(model);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.CommissionType.FindAsync(((CommissionType)result.Tag).Id);
                Assert.AreEqual(model.Name, actual.Name);
            }
        }

        [TestMethod]
        public async Task UpdateCommissionType()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionType");

            //Given
            var lkp1 = new CommissionTypeEntity { Id = Guid.NewGuid(), Name = "1" };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(lkp1);

                context.SaveChanges();
            }

            var model = new CommissionType()
            {
                Id = lkp1.Id,
                Name = "1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new LookupService(context);

                //When
                var result = await service.UpdateCommissionType(model);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.CommissionType.FindAsync(model.Id);
                Assert.AreEqual(model.Name, actual.Name);
            }
        }

        #endregion

    }
}