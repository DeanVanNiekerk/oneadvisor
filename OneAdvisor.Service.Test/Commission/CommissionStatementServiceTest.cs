using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Directory.Model.Authentication;
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
                AmountIncludingVAT = 111,
                VAT = 11,
                Date = DateTime.Now,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 222,
                VAT = 22,
                Date = DateTime.Now.AddDays(-1),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            var cs3 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 333,
                VAT = 33,
                Date = DateTime.Now.AddDays(-2),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            var cs4 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                AmountIncludingVAT = 444,
                VAT = 44,
                Date = DateTime.Now.AddDays(-2),
                Processed = false,
                OrganisationId = user2.Organisation.Id
            };

            var commission1a = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 50,
                VAT = 5,
                CommissionStatementId = cs1.Id
            };

            var commission1b = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 50,
                VAT = 5,
                CommissionStatementId = cs1.Id
            };

            var commission2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = cs2.Id
            };

            var commission3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 300,
                VAT = 30,
                CommissionStatementId = cs3.Id
            };

            var commission4 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 40,
                VAT = 400,
                CommissionStatementId = cs4.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatement.Add(cs1);
                context.CommissionStatement.Add(cs2);
                context.CommissionStatement.Add(cs3);
                context.CommissionStatement.Add(cs4);

                context.Commission.Add(commission1a);
                context.Commission.Add(commission1b);
                context.Commission.Add(commission2);
                context.Commission.Add(commission3);
                context.Commission.Add(commission4);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
                var statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.AreEqual(3, statements.TotalItems);
                Assert.AreEqual(3, statements.Items.Count());

                Assert.AreEqual(150, statements.AverageAmountIncludingVAT);
                Assert.AreEqual(15, statements.AverageVAT);
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
                Assert.AreEqual(100, actual.ActualAmountIncludingVAT);
                Assert.AreEqual(10, actual.ActualVAT);
                Assert.AreEqual(2, actual.CommissionCount);

                actual = items[1];
                Assert.AreEqual(cs2.Id, actual.Id);

                actual = items[2];
                Assert.AreEqual(cs3.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2);
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
                statements = await service.GetCommissionStatements(queryOptions);

                Assert.AreEqual(1, statements.Items.Count());

                actual = statements.Items.First();
                Assert.AreEqual(cs4.Id, actual.Id);
            }
        }

        [TestMethod]
        public async Task GetCommissionStatements_DateFilter()
        {
            var options = TestHelper.GetDbContext("GetCommissionStatements_DateFilter");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                Date = new DateTime(2000, 1, 1),
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                Date = new DateTime(2000, 1, 20),
                OrganisationId = user1.Organisation.Id
            };

            var cs3 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                Date = new DateTime(2000, 1, 31),
                OrganisationId = user1.Organisation.Id
            };

            var cs4 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                Date = new DateTime(2000, 2, 1),
                OrganisationId = user1.Organisation.Id
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
                var scope = TestHelper.GetScopeOptions(user1);
                var filters = "startDate=1999-12-01;endDate=1999-12-31";
                var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, filters);
                var statements = await service.GetCommissionStatements(queryOptions);

                Assert.AreEqual(0, statements.TotalItems);
                Assert.AreEqual(0, statements.Items.Count());

                filters = "startDate=2000-01-01;endDate=2000-01-21";
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, filters);
                statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.AreEqual(2, statements.TotalItems);

                var items = statements.Items.ToList();
                Assert.AreEqual(cs2.Id, items[0].Id);
                Assert.AreEqual(cs1.Id, items[1].Id);

                filters = "startDate=2000-01-01;endDate=2000-01-31";
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, filters);
                statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.AreEqual(3, statements.TotalItems);
                Assert.AreEqual(3, statements.Items.Count());

                items = statements.Items.ToList();
                Assert.AreEqual(cs3.Id, items[0].Id);
                Assert.AreEqual(cs2.Id, items[1].Id);
                Assert.AreEqual(cs1.Id, items[2].Id);
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
                var scope = TestHelper.GetScopeOptions(user1);
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
                scope = TestHelper.GetScopeOptions(user2);
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
                var scopeOptions = TestHelper.GetScopeOptions(user1);
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
                var scopeOptions = TestHelper.GetScopeOptions(user1);
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