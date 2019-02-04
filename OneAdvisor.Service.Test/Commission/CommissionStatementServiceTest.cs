using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Commission.Model.CommissionStatement;

namespace OneAdvisor.Service.Test.Commission
{
    [TestClass]
    public class CommissionStatementServiceTest
    {
        [TestMethod]
        public async Task GetCommissionStatements()
        {
            var options = TestHelper.GetDbContext("GetCommissionStatements");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                Date = DateTime.Now,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                Date = DateTime.Now.AddDays(-1),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            var cs3 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 300,
                VAT = 30,
                Date = DateTime.Now.AddDays(-2),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            var cs4 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 10,
                VAT = 4,
                Date = DateTime.Now.AddDays(-2),
                Processed = false,
                OrganisationId = user2.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatement.Add(cs1);
                context.CommissionStatement.Add(cs2);
                context.CommissionStatement.Add(cs3);
                context.CommissionStatement.Add(cs4);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
                var statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.AreEqual(3, statements.TotalItems);
                Assert.AreEqual(3, statements.Items.Count());

                Assert.AreEqual(200, statements.AverageAmountIncludingVAT);
                Assert.AreEqual(20, statements.AverageVAT);
                Assert.AreEqual(600, statements.SumAmountIncludingVAT);
                Assert.AreEqual(60, statements.SumVAT);

                var items = statements.Items.ToList();
                var actual = items[0];
                Assert.AreEqual(cs1.Id, actual.Id);
                Assert.AreEqual(cs1.CompanyId, actual.CompanyId);
                Assert.AreEqual(cs1.Date, actual.Date);
                Assert.AreEqual(cs1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(cs1.VAT, actual.VAT);
                Assert.AreEqual(cs1.Processed, actual.Processed);
                Assert.AreEqual(cs1.OrganisationId, user1.Organisation.Id);

                actual = items[1];
                Assert.AreEqual(cs2.Id, actual.Id);

                actual = items[2];
                Assert.AreEqual(cs3.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
                statements = await service.GetCommissionStatements(queryOptions);

                Assert.AreEqual(1, statements.Items.Count());

                actual = statements.Items.First();
                Assert.AreEqual(cs4.Id, actual.Id);
            }
        }

        [TestMethod]
        public async Task GetCommissionStatement()
        {
            var options = TestHelper.GetDbContext("GetCommissionStatement");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                Date = DateTime.Now,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                Date = DateTime.Now.AddDays(-1),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatement.Add(cs1);
                context.CommissionStatement.Add(cs2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetCommissionStatement(scope, cs2.Id);

                //Then
                Assert.AreEqual(cs2.Id, actual.Id);
                Assert.AreEqual(cs2.CompanyId, actual.CompanyId);
                Assert.AreEqual(cs2.Date, actual.Date);
                Assert.AreEqual(cs2.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(cs2.VAT, actual.VAT);
                Assert.AreEqual(cs2.OrganisationId, user1.Organisation.Id);
                Assert.AreEqual(cs2.Processed, actual.Processed);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                actual = await service.GetCommissionStatement(scope, cs2.Id);
                Assert.IsNull(actual);
            }
        }



        [TestMethod]
        public async Task InsertCommissionStatement()
        {
            var options = TestHelper.GetDbContext("InsertCommissionStatement");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var cs1 = new CommissionStatementEdit
            {
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                Date = DateTime.Now,
                Processed = true
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.InsertCommissionStatement(scopeOptions, cs1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.CommissionStatement.FindAsync(((CommissionStatementEdit)result.Tag).Id);
                Assert.AreEqual(cs1.CompanyId, actual.CompanyId);
                Assert.AreEqual(cs1.Date, actual.Date);
                Assert.AreEqual(cs1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(cs1.VAT, actual.VAT);
                Assert.AreEqual(user1.Organisation.Id, user1.Organisation.Id);
                Assert.AreEqual(cs1.Processed, actual.Processed);
            }
        }




        [TestMethod]
        public async Task UpdateCommissionStatement()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionStatement");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                Date = DateTime.Now,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                Date = DateTime.Now.AddDays(-1),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatement.Add(cs1);
                context.CommissionStatement.Add(cs2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementService(context);

                var model = new CommissionStatementEdit
                {
                    Id = cs2.Id,
                    CompanyId = Guid.NewGuid(),
                    AmountIncludingVAT = 300,
                    VAT = 30,
                    Date = DateTime.Now.AddDays(-10),
                    Processed = true
                };

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.UpdateCommissionStatement(scopeOptions, model);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.CommissionStatement.FindAsync(model.Id);
                Assert.AreEqual(model.CompanyId, actual.CompanyId);
                Assert.AreEqual(model.Date, actual.Date);
                Assert.AreEqual(model.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(model.VAT, actual.VAT);
                Assert.AreEqual(user1.Organisation.Id, user1.Organisation.Id);
                Assert.AreEqual(model.Processed, actual.Processed);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.UpdateCommissionStatement(scopeOptions, model);
                Assert.IsFalse(result.Success);
            }
        }
    }
}