using System.Collections.Generic;
using System.IO;
using System.Linq;
using Xunit;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Import.Excel.Test.Readers.UniqueCommissionTypes.Source;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using System;

namespace OneAdvisor.Import.Excel.Test.Readers.UniqueCommissionTypes
{

    public class UniqueCommissionTypesReaderTest
    {
        public UniqueCommissionTypesReaderTest()
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

        [Fact]
        public void Read_Basic()
        {
            var sheetConfig = new SheetConfig()
            {
                HeaderIdentifier = new Identifier()
                {
                    Column = "A",
                    Value = "broker"
                },
                Fields = new List<Field>() {
                    new Field() { Name = "PolicyNumber", Column = "B" },
                    new Field() { Name = "AmountIncludingVAT", Column = "C" }
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "D;F"
                }
            };

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var bytes = System.Convert.FromBase64String(Basic_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new UniqueCommissionTypesReader(sheet);
            var commissionTypeValues = reader.Read(stream).ToList();

            Assert.Equal(3, commissionTypeValues.Count);
            Assert.Equal("val1;val3", commissionTypeValues[0]);
            Assert.Equal("val2;val3", commissionTypeValues[1]);
            Assert.Equal("val4;val6", commissionTypeValues[2]);
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

            var reader = new UniqueCommissionTypesReader(sheet);
            var commissionTypeValues = reader.Read(stream).ToList();

            Assert.Equal(6, commissionTypeValues.Count);
            Assert.Equal("comType2;code_1", commissionTypeValues[0]);
            Assert.Equal("comType2;code_2", commissionTypeValues[1]);
            Assert.Equal("comType1;code_3", commissionTypeValues[2]);
            Assert.Equal("comType1;code_2", commissionTypeValues[3]);
            Assert.Equal("comType3;code_3", commissionTypeValues[4]);
            Assert.Equal("comType3;code_1", commissionTypeValues[5]);
        }
    }

}
