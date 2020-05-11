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
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Service.Test.Client
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
            var lkp1 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc", DisplayOrder = 1 };
            var lkp2 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", DisplayOrder = 2 };
            var lkp3 = new PolicyTypeEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", DisplayOrder = 3 };

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

        #region Policy Product Type

        [Fact]
        public async Task GetPolicyProductTypes()
        {
            var options = TestHelper.GetDbContext("GetPolicyProductTypes");

            var policyType = TestHelper.InsertPolicyType(options);

            var char1 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "A", DisplayOrder = 0, PolicyTypeId = policyType.Id };
            var charDesc1 = new PolicyTypeCharacteristicDescription() { PolicyTypeCharacteristicId = char1.Id, Description = "Description 1" };

            //Given
            var lkp1 = new PolicyProductTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = "A",
                Code = "aa",
                PolicyTypeId = policyType.Id,
                PolicyTypeCharacteristics = new List<PolicyTypeCharacteristicDescription>() { charDesc1 }
            };
            var lkp2 = new PolicyProductTypeEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", PolicyTypeId = policyType.Id };
            var lkp3 = new PolicyProductTypeEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc", PolicyTypeId = policyType.Id };

            using (var context = new DataContext(options))
            {
                context.PolicyTypeCharacteristic.Add(char1);

                //Jumbled order
                context.PolicyProductType.Add(lkp2);
                context.PolicyProductType.Add(lkp1);
                context.PolicyProductType.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetPolicyProductTypes();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.Code, actual1.Code);
                Assert.Equal(lkp1.PolicyTypeId, actual1.PolicyTypeId);
                Assert.Equal(lkp1.PolicyTypeCharacteristics.Single().PolicyTypeCharacteristicId, actual1.PolicyTypeCharacteristics.Single().PolicyTypeCharacteristicId);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertPolicyProductType()
        {
            var options = TestHelper.GetDbContext("InsertPolicyProductType");

            var policyType = TestHelper.InsertPolicyType(options);

            var char1 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "A", DisplayOrder = 0, PolicyTypeId = policyType.Id };
            var charDesc1 = new PolicyTypeCharacteristicDescription() { PolicyTypeCharacteristicId = char1.Id, Description = "Description 1" };

            using (var context = new DataContext(options))
            {
                context.PolicyTypeCharacteristic.Add(char1);
                context.SaveChanges();
            }

            //Given
            var model = new PolicyProductType()
            {
                Name = "1",
                Code = "one",
                PolicyTypeId = policyType.Id,
                PolicyTypeCharacteristics = new List<PolicyTypeCharacteristicDescription>() { charDesc1 }
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var result = await service.InsertPolicyProductType(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.PolicyProductType.FindAsync(((PolicyProductType)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(model.PolicyTypeCharacteristics.Single().PolicyTypeCharacteristicId, actual.PolicyTypeCharacteristics.Single().PolicyTypeCharacteristicId);
            }
        }

        [Fact]
        public async Task UpdatePolicyProductType()
        {
            var options = TestHelper.GetDbContext("UpdatePolicyProductType");

            var policyType = TestHelper.InsertPolicyType(options);

            var char1 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "A", DisplayOrder = 0, PolicyTypeId = policyType.Id };
            var charDesc1 = new PolicyTypeCharacteristicDescription() { PolicyTypeCharacteristicId = char1.Id, Description = "Description 1" };
            var charDesc2 = new PolicyTypeCharacteristicDescription() { PolicyTypeCharacteristicId = char1.Id, Description = "Description 2" };

            //Given
            var lkp1 = new PolicyProductTypeEntity()
            {
                Name = "1",
                Code = "one",
                PolicyTypeId = policyType.Id,
                PolicyTypeCharacteristics = new List<PolicyTypeCharacteristicDescription>() { charDesc1 }
            };

            using (var context = new DataContext(options))
            {
                context.PolicyTypeCharacteristic.Add(char1);
                context.PolicyProductType.Add(lkp1);

                context.SaveChanges();
            }

            var model = new PolicyProductType()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                Code = "aa Updated",
                PolicyTypeId = policyType.Id,
                PolicyTypeCharacteristics = new List<PolicyTypeCharacteristicDescription>() { charDesc2 }
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var result = await service.UpdatePolicyProductType(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.PolicyProductType.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(model.PolicyTypeCharacteristics.Single().PolicyTypeCharacteristicId, actual.PolicyTypeCharacteristics.Single().PolicyTypeCharacteristicId);
            }
        }

        #endregion

        #region Policy Type Characteristics

        [Fact]
        public async Task GetPolicyTypeCharacteristics()
        {
            var options = TestHelper.GetDbContext("GetPolicyTypeCharacteristics");

            //Given
            var policyTypeId = Guid.NewGuid();
            var lkp1 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "A", DisplayOrder = 0, PolicyTypeId = policyTypeId };
            var lkp2 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "B", DisplayOrder = 1, PolicyTypeId = policyTypeId };
            var lkp3 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "C", DisplayOrder = 2, PolicyTypeId = policyTypeId };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.PolicyTypeCharacteristic.Add(lkp2);
                context.PolicyTypeCharacteristic.Add(lkp1);
                context.PolicyTypeCharacteristic.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetPolicyTypeCharacteristics();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.DisplayOrder, actual1.DisplayOrder);
                Assert.Equal(lkp1.PolicyTypeId, actual1.PolicyTypeId);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertPolicyTypeCharacteristic()
        {
            var options = TestHelper.GetDbContext("InsertPolicyTypeCharacteristic");

            //Given
            var model = new PolicyTypeCharacteristic()
            {
                Name = "1",
                DisplayOrder = 1,
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var result = await service.InsertPolicyTypeCharacteristic(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.PolicyTypeCharacteristic.FindAsync(((PolicyTypeCharacteristic)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.DisplayOrder, actual.DisplayOrder);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
            }
        }

        [Fact]
        public async Task UpdatePolicyTypeCharacteristic()
        {
            var options = TestHelper.GetDbContext("UpdatePolicyTypeCharacteristic");

            //Given
            var lkp1 = new PolicyTypeCharacteristicEntity { Id = Guid.NewGuid(), Name = "1", DisplayOrder = 1, PolicyTypeId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.PolicyTypeCharacteristic.Add(lkp1);

                context.SaveChanges();
            }

            var model = new PolicyTypeCharacteristic()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                DisplayOrder = 2,
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var result = await service.UpdatePolicyTypeCharacteristic(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.PolicyTypeCharacteristic.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.DisplayOrder, actual.DisplayOrder);
                Assert.Equal(model.PolicyTypeId, actual.PolicyTypeId);
            }
        }

        #endregion


        #region Policy Product

        [Fact]
        public async Task GetPolicyProducts()
        {
            var options = TestHelper.GetDbContext("GetPolicyProducts");

            //Given
            var lkp1 = new PolicyProductEntity { Id = Guid.NewGuid(), Name = "A", Code = "aa", PolicyProductTypeId = Guid.NewGuid(), CompanyId = Guid.NewGuid() };
            var lkp2 = new PolicyProductEntity { Id = Guid.NewGuid(), Name = "B", Code = "bb", PolicyProductTypeId = Guid.NewGuid(), CompanyId = Guid.NewGuid() };
            var lkp3 = new PolicyProductEntity { Id = Guid.NewGuid(), Name = "C", Code = "cc", PolicyProductTypeId = Guid.NewGuid(), CompanyId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.PolicyProduct.Add(lkp2);
                context.PolicyProduct.Add(lkp1);
                context.PolicyProduct.Add(lkp3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var actual = await service.GetPolicyProducts();

                //Then
                Assert.Equal(3, actual.Count);

                var actual1 = actual[0];
                Assert.Equal(lkp1.Id, actual1.Id);
                Assert.Equal(lkp1.Name, actual1.Name);
                Assert.Equal(lkp1.Code, actual1.Code);
                Assert.Equal(lkp1.PolicyProductTypeId, actual1.PolicyProductTypeId);
                Assert.Equal(lkp1.CompanyId, actual1.CompanyId);

                var actual2 = actual[1];
                Assert.Equal(lkp2.Id, actual2.Id);

                var actual3 = actual[2];
                Assert.Equal(lkp3.Id, actual3.Id);
            }
        }

        [Fact]
        public async Task InsertPolicyProduct()
        {
            var options = TestHelper.GetDbContext("InsertPolicyProduct");

            //Given
            var model = new PolicyProduct()
            {
                Name = "1",
                Code = "one",
                PolicyProductTypeId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var result = await service.InsertPolicyProduct(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.PolicyProduct.FindAsync(((PolicyProduct)result.Tag).Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyProductTypeId, actual.PolicyProductTypeId);
                Assert.Equal(model.CompanyId, actual.CompanyId);
            }
        }

        [Fact]
        public async Task UpdatePolicyProduct()
        {
            var options = TestHelper.GetDbContext("UpdatePolicyProduct");

            //Given
            var lkp1 = new PolicyProductEntity { Id = Guid.NewGuid(), Name = "1", Code = "aa", PolicyProductTypeId = Guid.NewGuid(), CompanyId = Guid.NewGuid() };

            using (var context = new DataContext(options))
            {
                context.PolicyProduct.Add(lkp1);

                context.SaveChanges();
            }

            var model = new PolicyProduct()
            {
                Id = lkp1.Id,
                Name = "1 Updated",
                Code = "aa Updated",
                PolicyProductTypeId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientLookupService(context);

                //When
                var result = await service.UpdatePolicyProduct(model);

                //Then
                Assert.True(result.Success);

                var actual = await context.PolicyProduct.FindAsync(model.Id);
                Assert.Equal(model.Name, actual.Name);
                Assert.Equal(model.Code, actual.Code);
                Assert.Equal(model.PolicyProductTypeId, actual.PolicyProductTypeId);
                Assert.Equal(model.CompanyId, actual.CompanyId);
            }
        }

        #endregion
    }
}