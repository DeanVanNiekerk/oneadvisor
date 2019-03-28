using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using Moq;
using OneAdvisor.Service.Common.BulkActions;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionStatementServiceTest
    {
        [Fact]
        public async Task GetCommissionStatements()
        {
            var options = TestHelper.GetDbContext("GetCommissionStatements");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            var company = TestHelper.InsertCompany(options);

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 111,
                VAT = 11,
                Date = DateTime.Now,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 222,
                VAT = 22,
                Date = DateTime.Now.AddDays(-1),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            var cs3 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 333,
                VAT = 33,
                Date = DateTime.Now.AddDays(-2),
                Processed = false,
                OrganisationId = user1.Organisation.Id
            };

            var cs4 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
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
                var service = new CommissionStatementService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
                var statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.Equal(3, statements.TotalItems);
                Assert.Equal(3, statements.Items.Count());

                Assert.Equal(600, statements.SumAmountIncludingVAT);
                Assert.Equal(60, statements.SumVAT);

                var items = statements.Items.ToList();
                var actual = items[0];
                Assert.Equal(cs1.Id, actual.Id);
                Assert.Equal(cs1.CompanyId, actual.CompanyId);
                Assert.Equal(cs1.Date, actual.Date);
                Assert.Equal(cs1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(cs1.VAT, actual.VAT);
                Assert.Equal(cs1.Processed, actual.Processed);
                Assert.Equal(cs1.OrganisationId, user1.Organisation.Id);
                Assert.Equal(100, actual.ActualAmountIncludingVAT);
                Assert.Equal(10, actual.ActualVAT);
                Assert.Equal(2, actual.CommissionCount);

                actual = items[1];
                Assert.Equal(cs2.Id, actual.Id);

                actual = items[2];
                Assert.Equal(cs3.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2);
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
                statements = await service.GetCommissionStatements(queryOptions);

                Assert.Single(statements.Items);

                actual = statements.Items.First();
                Assert.Equal(cs4.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetCommissionStatements_DateFilter()
        {
            var options = TestHelper.GetDbContext("GetCommissionStatements_DateFilter");

            var user1 = TestHelper.InsertUserDetailed(options);

            var company = TestHelper.InsertCompany(options);

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                Date = new DateTime(2000, 1, 1),
                OrganisationId = user1.Organisation.Id
            };

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                Date = new DateTime(2000, 1, 20),
                OrganisationId = user1.Organisation.Id
            };

            var cs3 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                Date = new DateTime(2000, 1, 31),
                OrganisationId = user1.Organisation.Id
            };

            var cs4 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
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
                var service = new CommissionStatementService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var filters = "startDate=1999-12-01;endDate=1999-12-31";
                var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, filters);
                var statements = await service.GetCommissionStatements(queryOptions);

                Assert.Equal(0, statements.TotalItems);
                Assert.Empty(statements.Items);

                filters = "startDate=2000-01-01;endDate=2000-01-21";
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, filters);
                statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.Equal(2, statements.TotalItems);

                var items = statements.Items.ToList();
                Assert.Equal(cs2.Id, items[0].Id);
                Assert.Equal(cs1.Id, items[1].Id);

                filters = "startDate=2000-01-01;endDate=2000-01-31";
                queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, filters);
                statements = await service.GetCommissionStatements(queryOptions);

                //Then
                Assert.Equal(3, statements.TotalItems);
                Assert.Equal(3, statements.Items.Count());

                items = statements.Items.ToList();
                Assert.Equal(cs3.Id, items[0].Id);
                Assert.Equal(cs2.Id, items[1].Id);
                Assert.Equal(cs1.Id, items[2].Id);
            }
        }

        [Fact]
        public async Task GetCommissionStatement()
        {
            var options = TestHelper.GetDbContext("GetCommissionStatement");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

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
                var service = new CommissionStatementService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetCommissionStatement(scope, cs2.Id);

                //Then
                Assert.Equal(cs2.Id, actual.Id);
                Assert.Equal(cs2.CompanyId, actual.CompanyId);
                Assert.Equal(cs2.Date, actual.Date);
                Assert.Equal(cs2.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(cs2.VAT, actual.VAT);
                Assert.Equal(cs2.OrganisationId, user1.Organisation.Id);
                Assert.Equal(cs2.Processed, actual.Processed);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2);
                actual = await service.GetCommissionStatement(scope, cs2.Id);
                Assert.Null(actual);
            }
        }



        [Fact]
        public async Task InsertCommissionStatement()
        {
            var options = TestHelper.GetDbContext("InsertCommissionStatement");

            var user1 = TestHelper.InsertUserDetailed(options);

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
                var service = new CommissionStatementService(context, null);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertCommissionStatement(scopeOptions, cs1);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionStatement.FindAsync(((CommissionStatementEdit)result.Tag).Id);
                Assert.Equal(cs1.CompanyId, actual.CompanyId);
                Assert.Equal(cs1.Date.Value.Date, actual.Date);
                Assert.Equal(cs1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(cs1.VAT, actual.VAT);
                Assert.Equal(user1.Organisation.Id, user1.Organisation.Id);
                Assert.Equal(cs1.Processed, actual.Processed);
            }
        }




        [Fact]
        public async Task UpdateCommissionStatement()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionStatement");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

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
                var service = new CommissionStatementService(context, null);

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
                Assert.True(result.Success);

                var actual = await context.CommissionStatement.FindAsync(model.Id);
                Assert.Equal(model.CompanyId, actual.CompanyId);
                Assert.Equal(model.Date.Value.Date, actual.Date);
                Assert.Equal(model.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(model.VAT, actual.VAT);
                Assert.Equal(user1.Organisation.Id, user1.Organisation.Id);
                Assert.Equal(model.Processed, actual.Processed);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.UpdateCommissionStatement(scopeOptions, model);
                Assert.False(result.Success);
            }
        }


        [Fact]
        public async Task DeleteCommissions()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionStatement");

            var user1 = TestHelper.InsertUserDetailed(options);
            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);
            var statement2 = TestHelper.InsertCommissionStatement(options, user2.Organisation);

            using (var context = new DataContext(options))
            {

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);

                var actualCommissionStatementId1 = Guid.Empty;
                bulkActions.Setup(c => c.BatchDeleteCommissionsAsync(It.IsAny<DataContext>(), It.IsAny<Guid>()))
                    .Callback((DataContext c, Guid g1) => actualCommissionStatementId1 = g1)
                    .Returns(Task.CompletedTask);

                var actualCommissionStatementId2 = Guid.Empty;
                bulkActions.Setup(c => c.BatchDeleteCommissionErrorsAsync(It.IsAny<DataContext>(), It.IsAny<Guid>()))
                    .Callback((DataContext c, Guid g1) => actualCommissionStatementId2 = g1)
                    .Returns(Task.CompletedTask);

                var service = new CommissionStatementService(context, bulkActions.Object);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                await service.DeleteCommissions(scopeOptions, statement1.Id);

                //Then
                Assert.Equal(statement1.Id, actualCommissionStatementId1);
                Assert.Equal(statement1.Id, actualCommissionStatementId2);

                //Reset
                actualCommissionStatementId1 = Guid.Empty;
                actualCommissionStatementId2 = Guid.Empty;

                // //Out of scope 
                await service.DeleteCommissions(scopeOptions, statement2.Id);
                Assert.Equal(Guid.Empty, actualCommissionStatementId1);
                Assert.Equal(Guid.Empty, actualCommissionStatementId2);
            }
        }
    }
}