using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

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
                Assert.Equal(actual.TotalItems, 0);
                Assert.Equal(actual.Items.Count(), 0);
            }
        }

        [Fact]
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
                var scope = TestHelper.GetScopeOptions(Guid.NewGuid());
                scope.IgnoreScope = true;
                var queryOptions = new OrganisationQueryOptions(scope);
                var actual = await service.GetOrganisations(queryOptions);

                //Then
                Assert.Equal(actual.TotalItems, 6);

                var organisations = actual.Items.ToArray();

                Assert.Equal(organisations.Count(), 6);

                var actual1 = organisations[0];
                Assert.Equal(org1.Id, actual1.Id);
                Assert.Equal(org1.Name, actual1.Name);

                var actual2 = organisations[1];
                Assert.Equal(org2.Id, actual2.Id);
                Assert.Equal(org2.Name, actual2.Name);

                var actual6 = organisations[5];
                Assert.Equal(org6.Id, actual6.Id);
                Assert.Equal(org6.Name, actual6.Name);

                //Scope check
                scope = TestHelper.GetScopeOptions(org6.Id);
                queryOptions = new OrganisationQueryOptions(scope);
                actual = await service.GetOrganisations(queryOptions);

                Assert.Equal(actual.TotalItems, 1);

                organisations = actual.Items.ToArray();

                actual1 = organisations[0];
                Assert.Equal(org6.Id, actual1.Id);
                Assert.Equal(org6.Name, actual1.Name);
            }
        }

        [Fact]
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
                var scope = TestHelper.GetScopeOptions(org2.Id);
                var actual = await service.GetOrganisation(scope, org2.Id);

                //Then
                Assert.Equal(org2.Id, actual.Id);
                Assert.Equal(org2.Name, actual.Name);

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

            //Given
            var organisation = new Organisation()
            {
                Name = "Organsation 1"
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

                var actual = await context.Organisation.FindAsync(((Organisation)result.Tag).Id);
                Assert.Equal(organisation.Name, actual.Name);

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

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org2);

                context.SaveChanges();
            }

            var organisation = new Organisation()
            {
                Id = user1.Organisation.Id,
                Name = "Org 1 Updated"
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

                //Scope check
                organisation.Id = org2.Id;
                result = await service.UpdateOrganisation(scope, organisation);

                //Then
                Assert.False(result.Success);

            }
        }

    }
}