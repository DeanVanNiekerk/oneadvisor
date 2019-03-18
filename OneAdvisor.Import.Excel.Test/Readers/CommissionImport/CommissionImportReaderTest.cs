using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Import.Excel.Test.Readers.CommissionImport.Source;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using Xunit;

namespace OneAdvisor.Import.Excel.Test.Readers.CommissionImport
{
    public class CommissionImportReaderTest
    {
        public CommissionImportReaderTest()
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

        [Fact]
        public void Read_DefaultTemplate()
        {
            var config = new Config()
            {
                //No header
                HeaderIdentifier = new HeaderIdentifier()
                {
                    Column = "",
                    Value = ""
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "B" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.VAT), Column = "C" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.LastName), Column = "E" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.DateOfBirth), Column = "F" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.FirstName), Column = "G" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.IdNumber), Column = "H" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.Initials), Column = "I" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.FullName), Column = "J" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.BrokerFullName), Column = "K" }
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "D",
                    DefaultCommissionTypeCode = "unknown",
                    Types = new List<CommissionType>()
                    {
                        new CommissionType() { CommissionTypeCode = "code_1", Value = "code_1" },
                        new CommissionType() { CommissionTypeCode = "code_2", Value = "code_2" },
                        new CommissionType() { CommissionTypeCode = "code_3", Value = "code_3" }
                    }
                }
            };

            var bytes = System.Convert.FromBase64String(DefaultTemplate_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config);
            var commissions = reader.Read(stream).ToList();

            //Check we are testing all fields
            var importCommissionProps = typeof(ImportCommission).GetProperties();
            Assert.Equal(importCommissionProps.Count() - 3, config.Fields.Count()); //minus 3 for Id, CommissionTypeValue and CommissionTypeCode

            Assert.Equal(3, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("100", actual.AmountIncludingVAT);
            Assert.Equal("14", actual.VAT);
            Assert.Equal("code_1", actual.CommissionTypeCode);
            Assert.Equal("code_1", actual.CommissionTypeValue);
            Assert.Equal("ln_1", actual.LastName);
            Assert.Equal("1982-10-03", actual.DateOfBirth);
            Assert.Equal("fn_1", actual.FirstName);
            Assert.Equal("8210035032082", actual.IdNumber);
            Assert.Equal("ini_1", actual.Initials);
            Assert.Equal("fullName_1", actual.FullName);
            Assert.Equal("brokerFullName_1", actual.BrokerFullName);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal("15", actual.VAT);
            Assert.Equal("code_2", actual.CommissionTypeCode);
            Assert.Equal("code_2", actual.CommissionTypeValue);
            Assert.Equal("ln_2", actual.LastName);
            Assert.Null(actual.DateOfBirth);
            Assert.Equal("fn_2", actual.FirstName);
            Assert.Equal("8210035032082", actual.IdNumber);
            Assert.Equal("ini_2", actual.Initials);
            Assert.Equal("fullName_2", actual.FullName);
            Assert.Equal("brokerFullName_2", actual.BrokerFullName);

            actual = commissions[2];
            Assert.Equal("987654", actual.PolicyNumber);
            Assert.Equal("300", actual.AmountIncludingVAT);
            Assert.Equal("16", actual.VAT);
            Assert.Equal("unknown", actual.CommissionTypeCode);
            Assert.Equal("", actual.CommissionTypeValue);
            Assert.Equal("ln_3", actual.LastName);
            Assert.Equal("1982-10-05", actual.DateOfBirth);
            Assert.Equal("fn_3", actual.FirstName);
            Assert.Null(actual.IdNumber);
            Assert.Equal("ini_3", actual.Initials);
            Assert.Equal("fullName_3", actual.FullName);
            Assert.Equal("brokerFullName_3", actual.BrokerFullName);
        }

        [Fact]
        public void Read_OnlyAmountIncludingVAT()
        {
            var config = new Config()
            {
                //No header
                HeaderIdentifier = new HeaderIdentifier()
                {
                    Column = "",
                    Value = ""
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "B" },
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "",
                    DefaultCommissionTypeCode = "unknown"
                }
            };

            var bytes = System.Convert.FromBase64String(OnlyAmountIncludingVAT_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(2, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("115", actual.AmountIncludingVAT);
            Assert.Equal("15", actual.VAT);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal("26.09", actual.VAT);
        }

        [Fact]
        public void Read_OnlyAmountExcludingVAT()
        {
            var config = new Config()
            {
                //No header
                HeaderIdentifier = new HeaderIdentifier()
                {
                    Column = "",
                    Value = ""
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountExcludingVAT), Column = "B" },
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "",
                    DefaultCommissionTypeCode = "unknown"
                }
            };

            var bytes = System.Convert.FromBase64String(OnlyAmountExcludingVAT_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(2, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("115.00", actual.AmountIncludingVAT);
            Assert.Equal("15.00", actual.VAT);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal("230.00", actual.AmountIncludingVAT);
            Assert.Equal("30.00", actual.VAT);
        }
    }
}
