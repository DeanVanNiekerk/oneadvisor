using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Common;
using OneAdvisor.Service.Commission;

namespace OneAdvisor.Service.Test.Commission
{
    [TestClass]
    public class CommissionStatementTemplateServiceTest
    {
        [TestMethod]
        public async Task GetTemplates()
        {
            var options = TestHelper.GetDbContext("GetTemplates");

            //Given
            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = new Config()
            };

            var temp2 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 2",
                Config = new Config()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatementTemplate.Add(temp1);
                context.CommissionStatementTemplate.Add(temp2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementTemplateService(context);

                //When
                var actual = await service.GetTemplates();

                //Then
                Assert.AreEqual(actual.TotalItems, 2);

                var templates = actual.Items.ToArray();

                Assert.AreEqual(templates.Count(), 2);

                var actual1 = templates[0];
                Assert.AreEqual(temp1.Id, actual1.Id);
                Assert.AreEqual(temp1.Name, actual1.Name);
                Assert.AreEqual(temp1.CompanyId, actual1.CompanyId);

                var actual2 = templates[1];
                Assert.AreEqual(temp2.Id, actual2.Id);
                Assert.AreEqual(temp2.Name, actual2.Name);
                Assert.AreEqual(temp2.CompanyId, actual2.CompanyId);
            }
        }

        [TestMethod]
        public async Task GetTemplate()
        {
            var options = TestHelper.GetDbContext("GetTemplate");

            //Given
            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = new Config()
                {
                    HeaderIdentifier = new HeaderIdentifier()
                    {
                        Column = "A",
                        Value = "Broker"
                    }
                }
            };

            var temp2 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatementTemplate.Add(temp2);
                context.CommissionStatementTemplate.Add(temp1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementTemplateService(context);

                //When
                var actual = await service.GetTemplate(temp1.Id);

                //Then
                Assert.AreEqual(temp1.Id, actual.Id);
                Assert.AreEqual(temp1.Name, actual.Name);
                Assert.AreEqual(temp1.CompanyId, actual.CompanyId);
                Assert.AreEqual(temp1.Config, actual.Config);
            }
        }

        [TestMethod]
        public async Task InsertTemplate()
        {
            var options = TestHelper.GetDbContext("InsertTemplate");

            //Given
            var temp1 = new CommissionStatementTemplateEdit
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = GetValidConfig()
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementTemplateService(context);

                //When
                var result = await service.InsertTemplate(temp1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.CommissionStatementTemplate.FindAsync(temp1.Id);
                Assert.AreEqual(temp1.Name, actual.Name);
                Assert.AreEqual(temp1.CompanyId, actual.CompanyId);
                Assert.AreEqual(temp1.Config, actual.Config);
            }
        }

        [TestMethod]
        public async Task UpdateTemplate()
        {
            var options = TestHelper.GetDbContext("UpdateTemplate");

            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = new Config()
            };

            var temp2 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatementTemplate.Add(temp2);
                context.CommissionStatementTemplate.Add(temp1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var template = new CommissionStatementTemplateEdit
                {
                    Id = temp1.Id,
                    CompanyId = Guid.NewGuid(),
                    Name = "Template 1 updated",
                    Config = GetValidConfig()
                };

                var service = new CommissionStatementTemplateService(context);

                //When
                var result = await service.UpdateTemplate(template);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.CommissionStatementTemplate.FindAsync(temp1.Id);
                Assert.AreEqual(template.Name, actual.Name);
                Assert.AreEqual(template.CompanyId, actual.CompanyId);
                Assert.AreEqual(template.Config, actual.Config);
            }
        }

        private Config GetValidConfig()
        {
            return new Config()
            {
                HeaderIdentifier = new HeaderIdentifier()
                {
                    Column = "A",
                    Value = "Broker"
                },
                Fields = new List<Field>()
                {
                    new Field() { Name = "PolicyNumber", Column = "A" },
                    new Field() { Name = "AmountIncludingVAT", Column = "B" }
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "A;B",
                    DefaultCommissionTypeCode = "com_code_1"
                }
            };
        }
    }
}