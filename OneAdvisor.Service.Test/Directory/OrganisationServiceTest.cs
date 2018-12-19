using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
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
                var queryOptions = new OrganisationQueryOptions();
                var actual = await service.GetOrganisations(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 0);
                Assert.AreEqual(actual.Items.Count(), 0);
            }
        }

        [TestMethod]
        public async Task GetOrganisations_Sort()
        {
            var options = TestHelper.GetDbContext("GetOrganisations_Sort");

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "B Org 2" };
            var org3 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "C Org 3" };
            var org4 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "D Org 4" };
            var org5 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "E Org 5" };
            var org6 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "F Org 6" };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.Organisation.Add(org6);
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);
                context.Organisation.Add(org4);
                context.Organisation.Add(org5);
                context.Organisation.Add(org3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var queryOptions = new OrganisationQueryOptions();
                var actual = await service.GetOrganisations(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 6);

                var organisations = actual.Items.ToArray();

                Assert.AreEqual(organisations.Count(), 6);

                var actual1 = organisations[0];
                Assert.AreEqual(org1.Id, actual1.Id);
                Assert.AreEqual(org1.Name, actual1.Name);

                var actual2 = organisations[1];
                Assert.AreEqual(org2.Id, actual2.Id);
                Assert.AreEqual(org2.Name, actual2.Name);

                var actual6 = organisations[5];
                Assert.AreEqual(org6.Id, actual6.Id);
                Assert.AreEqual(org6.Name, actual6.Name);
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