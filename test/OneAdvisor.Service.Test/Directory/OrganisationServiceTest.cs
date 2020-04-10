using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Service.Directory;
using OneAdvisor.Model.Directory.Model.Organisation.Configuration;
using OneAdvisor.Model.Directory.Model.Application;

namespace OneAdvisor.Service.Test.Directory
{

    public class OrganisationServiceTest
    {

        [Fact]
        public async Task GetOrganisations_None()
        {
            var options = TestHelper.GetDbContext("GetOrganisations_None");

            //Given
            //Nothing

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(Guid.NewGuid());
                var queryOptions = new OrganisationQueryOptions(scope);
                var actual = await service.GetOrganisations(queryOptions);

                //Then
                Assert.Equal(0, actual.TotalItems);
                Assert.Empty(actual.Items);
            }
        }

        [Fact]
        public async Task GetOrganisations_Sort()
        {
            var options = TestHelper.GetDbContext("GetOrganisations_Sort");

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1", ApplicationIds = new List<Guid>() { Application.CLIENT_ID } };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "B Org 2", ApplicationIds = new List<Guid>() { Application.CLIENT_ID, Application.DIRECTORY_ID } };
            var org3 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "C Org 3", ApplicationIds = new List<Guid>() { Application.CLIENT_ID } };
            var org4 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "D Org 4", ApplicationIds = new List<Guid>() { Application.CLIENT_ID, Application.COMPLIANCE_ID } };
            var org5 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "E Org 5", ApplicationIds = new List<Guid>() { Application.CLIENT_ID } };
            var org6 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "F Org 6", ApplicationIds = new List<Guid>() { Application.CLIENT_ID } };

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
                var scope = TestHelper.GetScopeOptions(Guid.NewGuid());
                scope.IgnoreScope = true;
                var queryOptions = new OrganisationQueryOptions(scope);
                var actual = await service.GetOrganisations(queryOptions);

                //Then
                Assert.Equal(6, actual.TotalItems);

                var organisations = actual.Items.ToArray();

                Assert.Equal(6, organisations.Count());

                var actual1 = organisations[0];
                Assert.Equal(org1.Id, actual1.Id);
                Assert.Equal(org1.Name, actual1.Name);
                Assert.Equal(org1.ApplicationIds, actual1.ApplicationIds);

                var actual2 = organisations[1];
                Assert.Equal(org2.Id, actual2.Id);
                Assert.Equal(org2.Name, actual2.Name);
                Assert.Equal(org2.ApplicationIds, actual2.ApplicationIds);

                var actual6 = organisations[5];
                Assert.Equal(org6.Id, actual6.Id);
                Assert.Equal(org6.Name, actual6.Name);
                Assert.Equal(org6.ApplicationIds, actual6.ApplicationIds);

                //Scope check
                scope = TestHelper.GetScopeOptions(org6.Id);
                queryOptions = new OrganisationQueryOptions(scope);
                actual = await service.GetOrganisations(queryOptions);

                Assert.Equal(1, actual.TotalItems);

                organisations = actual.Items.ToArray();

                actual1 = organisations[0];
                Assert.Equal(org6.Id, actual1.Id);
                Assert.Equal(org6.Name, actual1.Name);
                Assert.Equal(org6.ApplicationIds, actual1.ApplicationIds);
            }
        }

        [Fact]
        public async Task GetOrganisation()
        {
            var options = TestHelper.GetDbContext("GetOrganisation");

            var config1 = new Config()
            {
                CompanyIds = new List<Guid>() { Guid.NewGuid() },
                VATRegistered = false,
                VATRegistrationDate = DateTime.Now.AddDays(-10)
            };

            var config2 = new Config()
            {
                CompanyIds = new List<Guid>() { Guid.NewGuid() },
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now
            };

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1", Config = config1, ApplicationIds = new List<Guid>() { Application.CLIENT_ID, Application.INVEST_ID } };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2", Config = config2, ApplicationIds = new List<Guid>() { Application.CLIENT_ID, Application.DIRECTORY_ID } };

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
                var scope = TestHelper.GetScopeOptions(org2.Id);
                var actual = await service.GetOrganisation(scope, org2.Id);

                //Then
                Assert.Equal(org2.Id, actual.Id);
                Assert.Equal(org2.Name, actual.Name);
                Assert.Equal(org2.ApplicationIds, actual.ApplicationIds);
                Assert.Equal(org2.Config.VATRegistered, actual.Config.VATRegistered);
                Assert.Equal(org2.Config.VATRegistrationDate, actual.Config.VATRegistrationDate);
                Assert.Single(actual.Config.CompanyIds);
                Assert.Equal(org2.Config.CompanyIds.Single(), actual.Config.CompanyIds.Single());

                //Scope check
                scope = TestHelper.GetScopeOptions(org1.Id);
                actual = await service.GetOrganisation(scope, org2.Id);

                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task InsertOrganisation()
        {
            var options = TestHelper.GetDbContext("InsertOrganisation");

            TestHelper.InsertApplications(options);
            var company1 = TestHelper.InsertCompany(options);

            var config1 = new Config()
            {
                CompanyIds = new List<Guid>() { company1.Id },
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now,
            };

            //Given
            var organisation = new OrganisationEdit()
            {
                Name = "Organsation 1",
                ApplicationIds = new List<Guid>() { Application.CLIENT_ID },
                Config = config1
            };

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(Guid.NewGuid());
                scope.IgnoreScope = true;
                var result = await service.InsertOrganisation(scope, organisation);

                //Then
                Assert.True(result.Success);

                var actual = await context.Organisation.FindAsync(((OrganisationEdit)result.Tag).Id);
                Assert.Equal(organisation.Name, actual.Name);
                Assert.Single(actual.ApplicationIds);
                Assert.Equal(organisation.ApplicationIds.Single(), actual.ApplicationIds.Single());
                Assert.Equal(organisation.Config.VATRegistered, actual.Config.VATRegistered);
                Assert.Equal(organisation.Config.VATRegistrationDate, actual.Config.VATRegistrationDate);
                Assert.Single(actual.Config.CompanyIds);
                Assert.Equal(organisation.Config.CompanyIds.Single(), actual.Config.CompanyIds.Single());

                //Scope check
                scope = TestHelper.GetScopeOptions(Guid.NewGuid());
                result = await service.InsertOrganisation(scope, organisation);

                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task UpdateOrganisation()
        {
            var options = TestHelper.GetDbContext("UpdateOrganisation");

            TestHelper.InsertApplications(options);

            var company1 = TestHelper.InsertCompany(options);
            var company2 = TestHelper.InsertCompany(options);

            var config1 = new Config()
            {
                CompanyIds = new List<Guid>() { company1.Id },
                VATRegistered = false,
                VATRegistrationDate = null
            };

            var config2 = new Config()
            {
                CompanyIds = new List<Guid>() { company1.Id },
                VATRegistered = false,
                VATRegistrationDate = null
            };

            //Given
            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1", Config = config1, ApplicationIds = new List<Guid>() { Application.CLIENT_ID } };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2", Config = config2, ApplicationIds = new List<Guid>() { Application.CLIENT_ID } };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);

                context.SaveChanges();
            }

            var user1 = TestHelper.InsertUserDetailed(options, org2);

            var config2Updated = new Config()
            {
                CompanyIds = new List<Guid>() { company2.Id },
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now,
            };

            var organisation = new OrganisationEdit()
            {
                Id = org2.Id,
                Name = "Org 2 Updated",
                ApplicationIds = new List<Guid>() { Application.CLIENT_ID, Application.COMMISSION_ID },
                Config = config2Updated
            };

            using (var context = new DataContext(options))
            {
                var service = new OrganisationService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateOrganisation(scope, organisation);

                //Then
                Assert.True(result.Success);

                var actual = await context.Organisation.FindAsync(organisation.Id);
                Assert.Equal(organisation.Name, actual.Name);
                Assert.Equal(2, organisation.ApplicationIds.Count());
                Assert.Contains(Application.CLIENT_ID, organisation.ApplicationIds);
                Assert.Contains(Application.COMMISSION_ID, organisation.ApplicationIds);
                Assert.Equal(organisation.Config.VATRegistered, actual.Config.VATRegistered);
                Assert.Equal(organisation.Config.VATRegistrationDate, actual.Config.VATRegistrationDate);
                Assert.Single(actual.Config.CompanyIds);
                Assert.Equal(organisation.Config.CompanyIds.Single(), actual.Config.CompanyIds.Single());


                //Scope check
                organisation.Id = org1.Id;
                result = await service.UpdateOrganisation(scope, organisation);

                //Then
                Assert.False(result.Success);

            }
        }

    }
}