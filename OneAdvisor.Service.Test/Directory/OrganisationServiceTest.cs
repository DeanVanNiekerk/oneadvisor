using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Directory
{
    [TestClass]
    public class OrganisationServiceTest
    {
       
        [TestMethod]
        public async Task GetOrganisations_None()
        {
            var options = TestHelper.GetDbContext("GetOrganisations_None");

            //Given
            //Nothing

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var actual = await service.GetOrganisations();

                //Then
                Assert.IsTrue(actual.Count() == 0);
            }
        }

        [TestMethod]
        public async Task GetOrganisations_Some()
        {
            var options = TestHelper.GetDbContext("GetOrganisations_Some");

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var actual = await service.GetOrganisations();

                //Then
                Assert.IsTrue(actual.Count() == 2);

                var actual1 = actual.Single(o => o.Id == org1.Id);
                Assert.AreEqual(org1.Name, actual1.Name);

                var actual2 = actual.Single(o => o.Id == org2.Id);
                Assert.AreEqual(org2.Name, actual2.Name);
            }
        }

        [TestMethod]
        public async Task GetOrganisation()
        {
            var options = TestHelper.GetDbContext("GetOrganisation");

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var actual = await service.GetOrganisation(org2.Id);

                //Then
                Assert.AreEqual(org2.Id, actual.Id);
                Assert.AreEqual(org2.Name, actual.Name);
            }
        }

        [TestMethod]
        public async Task InsertOrganisation()
        {
            var options = TestHelper.GetDbContext("InsertOrganisation");

            //Given
            var organisation = new Organisation()
            {
                Name = "Organsation 1"
            };

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var result = await service.InsertOrganisation(organisation);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Organisation.FindAsync(((Organisation)result.Tag).Id);
                Assert.AreEqual(organisation.Name, actual.Name);
            }
        }

        [TestMethod]
        public async Task UpdateOrganisation()
        {
            var options = TestHelper.GetDbContext("UpdateOrganisation");

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);

                context.SaveChanges();
            }

            var organisation = new Organisation()
            {
                Id = org2.Id,
                Name = "Organsation 1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var result = await service.UpdateOrganisation(organisation);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Organisation.FindAsync(organisation.Id);
                Assert.AreEqual(organisation.Name, actual.Name);
            }
        }

    }
}