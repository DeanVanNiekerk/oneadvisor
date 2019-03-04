using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Service.Commission;
using OneAdvisor.Service.Directory;

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
                var service = new CommissionStatementTemplateService(context, null);

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
                var service = new CommissionStatementTemplateService(context, null);

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
                var service = new CommissionStatementTemplateService(context, null);

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

                var service = new CommissionStatementTemplateService(context, null);

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

        [TestMethod]
        public async Task GetDefaultConfig()
        {
            var options = TestHelper.GetDbContext("GetDefaultConfig");

            var ct1 = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = "Type 1",
                Code = "type_1"
            };

            var ct2 = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = "Type 2",
                Code = "type_2"
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(ct1);
                context.CommissionType.Add(ct2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var lookupService = new LookupService(context);
                var service = new CommissionStatementTemplateService(context, lookupService);

                //When
                var config = await service.GetDefaultConfig();

                //Then
                Assert.AreEqual("", config.HeaderIdentifier.Column);
                Assert.AreEqual("", config.HeaderIdentifier.Value);

                var importCommissionProps = typeof(ImportCommission).GetProperties();
                var fields = config.Fields.ToList();
                Assert.AreEqual(importCommissionProps.Count() - 3, fields.Count()); //minus 3 for Id, CommissionTypeValue and CommissionTypeCode
                Assert.AreEqual("PolicyNumber", fields[0].Name);
                Assert.AreEqual("A", fields[0].Column);
                Assert.AreEqual("AmountIncludingVAT", fields[1].Name);
                Assert.AreEqual("B", fields[1].Column);
                Assert.AreEqual("VAT", fields[2].Name);
                Assert.AreEqual("C", fields[2].Column);
                Assert.AreEqual("LastName", fields[3].Name);
                Assert.AreEqual("E", fields[3].Column);
                Assert.AreEqual("DateOfBirth", fields[4].Name);
                Assert.AreEqual("F", fields[4].Column);
                Assert.AreEqual("FirstName", fields[5].Name);
                Assert.AreEqual("G", fields[5].Column);
                Assert.AreEqual("IdNumber", fields[6].Name);
                Assert.AreEqual("H", fields[6].Column);
                Assert.AreEqual("Initials", fields[7].Name);
                Assert.AreEqual("I", fields[7].Column);
                Assert.AreEqual("FullName", fields[8].Name);
                Assert.AreEqual("J", fields[8].Column);
                Assert.AreEqual("BrokerFullName", fields[9].Name);
                Assert.AreEqual("K", fields[9].Column);

                Assert.AreEqual("D", config.CommissionTypes.MappingTemplate);
                Assert.AreEqual("unknown", config.CommissionTypes.DefaultCommissionTypeCode);
                var types = config.CommissionTypes.Types.ToList();
                Assert.AreEqual("type_1", types[0].CommissionTypeCode);
                Assert.AreEqual("type_1", types[0].Value);
                Assert.AreEqual("type_2", types[1].CommissionTypeCode);
                Assert.AreEqual("type_2", types[1].Value);
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