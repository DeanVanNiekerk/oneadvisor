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
        private decimal _vatRate = 15m;

        public CommissionImportReaderTest()
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

        [Fact]
        public void Read_DefaultTemplate()
        {
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
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

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(DefaultTemplate_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            //Check we are testing all fields
            var importCommissionProps = typeof(ImportCommission).GetProperties();
            Assert.Equal(importCommissionProps.Count() - 3, sheetConfig.Fields.Count()); //minus 3 for Id, CommissionTypeValue and CommissionTypeCode

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
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
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

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(OnlyAmountIncludingVAT_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(2, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("115", actual.AmountIncludingVAT);
            Assert.Equal("15", actual.VAT);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal(26.09m, Decimal.Parse(actual.VAT));
        }

        [Fact]
        public void Read_OnlyAmountExcludingVAT()
        {
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
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

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(OnlyAmountExcludingVAT_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(2, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal(115.00m, Decimal.Parse(actual.AmountIncludingVAT));
            Assert.Equal(15.00m, Decimal.Parse(actual.VAT));

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal(230.00m, Decimal.Parse(actual.AmountIncludingVAT));
            Assert.Equal(30.00m, Decimal.Parse(actual.VAT));
        }

        [Fact]
        public void Read_AbsoluteValues()
        {
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
                {
                    Column = "",
                    Value = ""
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "B", AbsoluteValue = true },
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "",
                    DefaultCommissionTypeCode = "unknown"
                }
            };

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(AbsoluteValues_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(2, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("115", actual.AmountIncludingVAT);
            Assert.Equal("15", actual.VAT);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal(26.09m, Decimal.Parse(actual.VAT));
        }

        [Fact]
        public void Read_Groupings()
        {
            var sheetConfig = new SheetConfig()
            {
                HeaderIdentifier = new Identifier()
                {
                    Column = "A",
                    Value = "Policy Number"
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "B" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "C" },
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "GRP_CT;D",
                    DefaultCommissionTypeCode = "unknown",
                    Types = new List<CommissionType>()
                    {
                        new CommissionType() { CommissionTypeCode = "type_1", Value = "comType1;code_1" },
                        new CommissionType() { CommissionTypeCode = "type_2", Value = "comType1;code_2" },
                        new CommissionType() { CommissionTypeCode = "type_3", Value = "comType2;code_3" },
                        new CommissionType() { CommissionTypeCode = "type_4", Value = "comType2;code_2" },
                        new CommissionType() { CommissionTypeCode = "type_5", Value = ";code_2" },
                        new CommissionType() { CommissionTypeCode = "type_6", Value = "comType1;code_3" },
                    }
                },
                Groups = new List<Group>() {
                    new Group() {
                        FieldName = "BrokerFullName",
                        Column= "A",
                        Formatter=".+?(?= : Broker)", //Take everything before ': Broker'
                        ReverseOrder = false,
                        Identifiers = new List<Identifier>()
                        {
                            new Identifier() { Column = "A", Value = ": Broker" }, //Contains ': Broker'
                            new Identifier() { Column = "B", Value = "^(?![\\s\\S])" }, //Empy text
                        }
                    },
                    new Group() {
                        FieldName = "CommissionType",
                        Column= "A",
                        ReverseOrder = false,
                        Identifiers = new List<Identifier>()
                        {
                            new Identifier() { Column = "A", Value = "\\b" }, //Any word
                            new Identifier() { Column = "B", Value = "\\d" }, //Any number
                            new Identifier() { Column = "C", Value = "^(?![\\s\\S])" }, //Empy text
                            new Identifier() { Column = "D", Value = "^(?![\\s\\S])" }, //Empy text
                        }
                    },
                },
            };

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(Groupings_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(7, commissions.Count);

            var actual = commissions[0];
            Assert.Equal("11111", actual.PolicyNumber);
            Assert.Equal("100", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_1", actual.CommissionTypeCode);

            actual = commissions[1];
            Assert.Equal("22222", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_2", actual.CommissionTypeCode);

            actual = commissions[2];
            Assert.Equal("33333", actual.PolicyNumber);
            Assert.Equal("300", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_3", actual.CommissionTypeCode);

            actual = commissions[3];
            Assert.Equal("44444", actual.PolicyNumber);
            Assert.Equal("400", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_4", actual.CommissionTypeCode);

            actual = commissions[4];
            Assert.Equal("55555", actual.PolicyNumber);
            Assert.Equal("500", actual.AmountIncludingVAT);
            Assert.Equal("Marc Bormann", actual.BrokerFullName);
            Assert.Equal("type_5", actual.CommissionTypeCode);

            actual = commissions[5];
            Assert.Equal("66666", actual.PolicyNumber);
            Assert.Equal("600", actual.AmountIncludingVAT);
            Assert.Equal("Marc Bormann", actual.BrokerFullName);
            Assert.Equal("type_6", actual.CommissionTypeCode);

            actual = commissions[6];
            Assert.Equal("77777", actual.PolicyNumber);
            Assert.Equal("700", actual.AmountIncludingVAT);
            Assert.Equal("Marc Bormann", actual.BrokerFullName);
            Assert.Equal("type_6", actual.CommissionTypeCode);
        }

        [Fact]
        public void Read_GroupingsReverseOrder()
        {
            var sheetConfig = new SheetConfig()
            {
                HeaderIdentifier = new Identifier()
                {
                    Column = "A",
                    Value = "Policy Number"
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "B" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "C" },
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "GRP_CT;D",
                    DefaultCommissionTypeCode = "unknown",
                    Types = new List<CommissionType>()
                    {
                        new CommissionType() { CommissionTypeCode = "type_1", Value = "comType3;code_1" },
                        new CommissionType() { CommissionTypeCode = "type_2", Value = "comType3;code_3" },
                        new CommissionType() { CommissionTypeCode = "type_3", Value = "comType1;code_2" },
                        new CommissionType() { CommissionTypeCode = "type_4", Value = "comType1;code_3" },
                        new CommissionType() { CommissionTypeCode = "type_5", Value = "comType2;code_2" },
                        new CommissionType() { CommissionTypeCode = "type_6", Value = "comType2;code_1" },
                    }
                },
                Groups = new List<Group>() {
                    new Group() {
                        FieldName = "BrokerFullName",
                        Column= "A",
                        Formatter=".+?(?= : Broker)", //Take everything before ': Broker'
                        ReverseOrder = false,
                        Identifiers = new List<Identifier>()
                        {
                            new Identifier() { Column = "A", Value = ": Broker" }, //Contains ': Broker'
                            new Identifier() { Column = "B", Value = "^(?![\\s\\S])" }, //Empy text
                        }
                    },
                    new Group() {
                        FieldName = "CommissionType",
                        Column= "A",
                        ReverseOrder = true,
                        Identifiers = new List<Identifier>()
                        {
                            new Identifier() { Column = "A", Value = "\\b" }, //Any word
                            new Identifier() { Column = "B", Value = "\\d" }, //Any number
                            new Identifier() { Column = "C", Value = "^(?![\\s\\S])" }, //Empy text
                            new Identifier() { Column = "D", Value = "^(?![\\s\\S])" }, //Empy text
                        }
                    },
                },
            };

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(GroupingsReverseOrder_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(7, commissions.Count);

            var actual = commissions[0];
            Assert.Equal("11111", actual.PolicyNumber);
            Assert.Equal("100", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_6", actual.CommissionTypeCode);

            actual = commissions[1];
            Assert.Equal("22222", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_5", actual.CommissionTypeCode);

            actual = commissions[2];
            Assert.Equal("33333", actual.PolicyNumber);
            Assert.Equal("300", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_4", actual.CommissionTypeCode);

            actual = commissions[3];
            Assert.Equal("44444", actual.PolicyNumber);
            Assert.Equal("400", actual.AmountIncludingVAT);
            Assert.Equal("Dean van Niekerk", actual.BrokerFullName);
            Assert.Equal("type_3", actual.CommissionTypeCode);

            actual = commissions[4];
            Assert.Equal("55555", actual.PolicyNumber);
            Assert.Equal("500", actual.AmountIncludingVAT);
            Assert.Equal("Marc Bormann", actual.BrokerFullName);
            Assert.Equal("type_3", actual.CommissionTypeCode);

            actual = commissions[5];
            Assert.Equal("66666", actual.PolicyNumber);
            Assert.Equal("600", actual.AmountIncludingVAT);
            Assert.Equal("Marc Bormann", actual.BrokerFullName);
            Assert.Equal("type_2", actual.CommissionTypeCode);

            actual = commissions[6];
            Assert.Equal("77777", actual.PolicyNumber);
            Assert.Equal("700", actual.AmountIncludingVAT);
            Assert.Equal("Marc Bormann", actual.BrokerFullName);
            Assert.Equal("type_1", actual.CommissionTypeCode);
        }

        [Fact]
        public void Read_CommissionTypeSubstring()
        {
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
                {
                    Column = "",
                    Value = ""
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "B" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.VAT), Column = "C" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.BrokerFullName), Column = "K" }
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "D(1-6)",
                    DefaultCommissionTypeCode = "unknown",
                    Types = new List<CommissionType>()
                    {
                        new CommissionType() { CommissionTypeCode = "code_1", Value = "code_1" },
                        new CommissionType() { CommissionTypeCode = "code_2", Value = "code_2" },
                        new CommissionType() { CommissionTypeCode = "code_3", Value = "code_3" }
                    }
                }
            };

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(CommissionTypeSubstring_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(3, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("100", actual.AmountIncludingVAT);
            Assert.Equal("14", actual.VAT);
            Assert.Equal("code_1", actual.CommissionTypeCode);
            Assert.Equal("code_1", actual.CommissionTypeValue);
            Assert.Equal("brokerFullName_1", actual.BrokerFullName);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal("200", actual.AmountIncludingVAT);
            Assert.Equal("15", actual.VAT);
            Assert.Equal("code_2", actual.CommissionTypeCode);
            Assert.Equal("code_2", actual.CommissionTypeValue);
            Assert.Equal("brokerFullName_2", actual.BrokerFullName);

            actual = commissions[2];
            Assert.Equal("987654", actual.PolicyNumber);
            Assert.Equal("300", actual.AmountIncludingVAT);
            Assert.Equal("16", actual.VAT);
            Assert.Equal("code_3", actual.CommissionTypeCode);
            Assert.Equal("code_3", actual.CommissionTypeValue);
            Assert.Equal("brokerFullName_3", actual.BrokerFullName);
        }

        [Fact]
        public void Read_AmountIdentifier()
        {
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
                {
                    Column = "",
                    Value = ""
                },
                AmountIdentifier = new AmountIdentifier()
                {
                    Column = "B",
                    Type = AmountIdentifier.AmountIdentifierTypeIncludingVat,
                    Value = "^Including"
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.Amount), Column = "C" },
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "",
                    DefaultCommissionTypeCode = "unknown"
                }
            };

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            var bytes = System.Convert.FromBase64String(AmountIdentifier_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new CommissionImportReader(config, _vatRate);
            var commissions = reader.Read(stream).ToList();

            Assert.Equal(3, commissions.Count);
            var actual = commissions[0];
            Assert.Equal("123456", actual.PolicyNumber);
            Assert.Equal("115", actual.AmountIncludingVAT);
            Assert.Equal("15", actual.VAT);

            actual = commissions[1];
            Assert.Equal("654321", actual.PolicyNumber);
            Assert.Equal(230m, Decimal.Parse(actual.AmountIncludingVAT));
            Assert.Equal(30m, Decimal.Parse(actual.VAT));

            actual = commissions[2];
            Assert.Equal("987654", actual.PolicyNumber);
            Assert.Equal("400", actual.AmountIncludingVAT);
            Assert.Equal(52.17m, Decimal.Parse(actual.VAT));
        }
    }
}
