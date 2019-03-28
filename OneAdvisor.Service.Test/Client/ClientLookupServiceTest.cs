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

namespace OneAdvisor.Service.Test.Directory
{

    public class ClientLookupServiceTest
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
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetContactTypes();

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

        #region Policy Type

        [Fact]
        public async Task GetPolicyTypes()
        {
            var options = TestHelper.GetDbContext("GetPolicyTypes");

            //Given
            var lkp1 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa" };
            var lkp2 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb" };
            var lkp3 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc" };

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
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetPolicyTypes();

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

        #endregion

        #region Client Type

        [Fact]
        public async Task GetClientTypes()
        {
            var options = TestHelper.GetDbContext("GetClientTypes");

            //Given
            var lkp1 = new ClientTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", DisplayOrder = 1 };
            var lkp2 = new ClientTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", DisplayOrder = 2 };
            var lkp3 = new ClientTypeEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc", DisplayOrder = 3 };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.ClientType.Add(lkp2);
                context.ClientType.Add(lkp1);
                context.ClientType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetClientTypes();

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
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetMarritalStatus();

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