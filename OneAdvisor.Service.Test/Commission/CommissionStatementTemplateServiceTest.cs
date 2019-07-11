using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Service.Commission;
using OneAdvisor.Service.Directory;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionStatementTemplateServiceTest
    {
        [Fact]
        public async Task GetTemplates()
        {
            var options = TestHelper.GetDbContext("GetTemplates");

            //Given
            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
                Config = new Config()
            };

            var temp2 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 2",
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
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
                var queryOptions = new CommissionStatementTemplateQueryOptions("", "", 0, 0);
                var actual = await service.GetTemplates(queryOptions);

                //Then
                Assert.Equal(2, actual.TotalItems);

                var templates = actual.Items.ToArray();

                Assert.Equal(2, templates.Count());

                var actual1 = templates[0];
                Assert.Equal(temp1.Id, actual1.Id);
                Assert.Equal(temp1.Name, actual1.Name);
                Assert.Equal(temp1.CompanyId, actual1.CompanyId);
                Assert.Equal(temp1.StartDate, actual1.StartDate);
                Assert.Equal(temp1.EndDate, actual1.EndDate);

                var actual2 = templates[1];
                Assert.Equal(temp2.Id, actual2.Id);
                Assert.Equal(temp2.Name, actual2.Name);
                Assert.Equal(temp2.CompanyId, actual2.CompanyId);
                Assert.Equal(temp2.StartDate, actual2.StartDate);
                Assert.Equal(temp2.EndDate, actual2.EndDate);
            }
        }

        [Fact]
        public async Task GetTemplates_DateFilter()
        {
            var options = TestHelper.GetDbContext("GetTemplates_DateFilter");

            var now = DateTime.Now.Date;

            //Given
            //Start and End in scope
            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                StartDate = now.AddMonths(-1),
                EndDate = now.AddMonths(1),
                Config = new Config()
            };

            //Old start, old end, out of scope
            var temp2 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 2",
                StartDate = now.AddMonths(-12),
                EndDate = now.AddMonths(-10),
                Config = new Config()
            };

            //Old start, no end, in scope
            var temp3 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 3",
                StartDate = now.AddMonths(-12),
                EndDate = null,
                Config = new Config()
            };

            //Future start, no end, out of scope
            var temp4 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 4",
                StartDate = now.AddDays(1),
                EndDate = null,
                Config = new Config()
            };

            //Future end, no start, in scope
            var temp5 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 5",
                StartDate = null,
                EndDate = now.AddMonths(1),
                Config = new Config()
            };

            //Old end, no start, out of scope
            var temp6 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 6",
                StartDate = null,
                EndDate = now.AddMonths(-5),
                Config = new Config()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionStatementTemplate.Add(temp1);
                context.CommissionStatementTemplate.Add(temp2);
                context.CommissionStatementTemplate.Add(temp3);
                context.CommissionStatementTemplate.Add(temp4);
                context.CommissionStatementTemplate.Add(temp5);
                context.CommissionStatementTemplate.Add(temp6);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementTemplateService(context, null);

                //When
                var queryOptions = new CommissionStatementTemplateQueryOptions("", "", 0, 0);
                queryOptions.Date = now;
                var result = await service.GetTemplates(queryOptions);

                //Then
                Assert.Equal(3, result.TotalItems);

                var templates = result.Items.ToArray();

                Assert.Equal(3, templates.Count());

                var actual = templates[0];
                Assert.Equal(temp1.Id, actual.Id);

                actual = templates[1];
                Assert.Equal(temp3.Id, actual.Id);

                actual = templates[2];
                Assert.Equal(temp5.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetTemplate()
        {
            var options = TestHelper.GetDbContext("GetTemplate");

            //Given
            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
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
                var service = new CommissionStatementTemplateService(context, null);

                //When
                var actual = await service.GetTemplate(temp1.Id);

                //Then
                Assert.Equal(temp1.Id, actual.Id);
                Assert.Equal(temp1.Name, actual.Name);
                Assert.Equal(temp1.CompanyId, actual.CompanyId);
                Assert.Equal(temp1.Config, actual.Config);
                Assert.Equal(temp1.StartDate, actual.StartDate);
                Assert.Equal(temp1.EndDate, actual.EndDate);
            }
        }

        [Fact]
        public async Task InsertTemplate()
        {
            var options = TestHelper.GetDbContext("InsertTemplate");

            //Given
            var temp1 = new CommissionStatementTemplateEdit
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
                Config = GetValidConfig()
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionStatementTemplateService(context, null);

                //When
                var result = await service.InsertTemplate(temp1);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionStatementTemplate.FindAsync(temp1.Id);
                Assert.Equal(temp1.Name, actual.Name);
                Assert.Equal(temp1.CompanyId, actual.CompanyId);
                Assert.Equal(temp1.Config, actual.Config);
                Assert.Equal(temp1.StartDate.Value.Date, actual.StartDate);
                Assert.Equal(temp1.EndDate.Value.Date, actual.EndDate);
            }
        }

        [Fact]
        public async Task UpdateTemplate()
        {
            var options = TestHelper.GetDbContext("UpdateTemplate");

            var temp1 = new CommissionStatementTemplateEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
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
                    StartDate = DateTime.Now.AddDays(-2),
                    EndDate = DateTime.Now.AddDays(2),
                    Config = GetValidConfig()
                };

                var service = new CommissionStatementTemplateService(context, null);

                //When
                var result = await service.UpdateTemplate(template);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionStatementTemplate.FindAsync(temp1.Id);
                Assert.Equal(template.Name, actual.Name);
                Assert.Equal(template.CompanyId, actual.CompanyId);
                Assert.Equal(template.Config, actual.Config);
                Assert.Equal(template.StartDate.Value.Date, actual.StartDate);
                Assert.Equal(template.EndDate.Value.Date, actual.EndDate);
            }
        }

        [Fact]
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
                var lookupService = new CommissionLookupService(context);
                var service = new CommissionStatementTemplateService(context, lookupService);

                //When
                var config = await service.GetDefaultConfig();

                var sheetConfig = config.Sheets.Single().Config;

                //Then
                Assert.Equal("", sheetConfig.HeaderIdentifier.Column);
                Assert.Equal("", sheetConfig.HeaderIdentifier.Value);

                var importCommissionProps = typeof(ImportCommission).GetProperties();
                var fields = sheetConfig.Fields.ToList();
                Assert.Equal(importCommissionProps.Count() - 3, fields.Count()); //minus 3 for Id, CommissionTypeValue and CommissionTypeCode
                Assert.Equal("PolicyNumber", fields[0].Name);
                Assert.Equal("A", fields[0].Column);
                Assert.Equal("AmountIncludingVAT", fields[1].Name);
                Assert.Equal("B", fields[1].Column);
                Assert.Equal("VAT", fields[2].Name);
                Assert.Equal("C", fields[2].Column);
                Assert.Equal("LastName", fields[3].Name);
                Assert.Equal("E", fields[3].Column);
                Assert.Equal("DateOfBirth", fields[4].Name);
                Assert.Equal("F", fields[4].Column);
                Assert.Equal("FirstName", fields[5].Name);
                Assert.Equal("G", fields[5].Column);
                Assert.Equal("IdNumber", fields[6].Name);
                Assert.Equal("H", fields[6].Column);
                Assert.Equal("Initials", fields[7].Name);
                Assert.Equal("I", fields[7].Column);
                Assert.Equal("FullName", fields[8].Name);
                Assert.Equal("J", fields[8].Column);
                Assert.Equal("BrokerFullName", fields[9].Name);
                Assert.Equal("K", fields[9].Column);

                Assert.Equal("D", sheetConfig.CommissionTypes.MappingTemplate);
                Assert.Equal("unknown", sheetConfig.CommissionTypes.DefaultCommissionTypeCode);
                var types = sheetConfig.CommissionTypes.Types.ToList();
                Assert.Equal("type_1", types[0].CommissionTypeCode);
                Assert.Equal("type_1", types[0].Value);
                Assert.Equal("type_2", types[1].CommissionTypeCode);
                Assert.Equal("type_2", types[1].Value);
            }
        }

        private Config GetValidConfig()
        {
            var sheetConfig = new SheetConfig()
            {
                HeaderIdentifier = new Identifier()
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

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            return config;
        }
    }
}