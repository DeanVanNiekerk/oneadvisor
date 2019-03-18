using System.Collections.Generic;
using System.IO;
using System.Linq;
using Xunit;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Import.Excel.Test.Readers.UniqueCommissionTypes.Source;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

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
            var config = new Config()
            {
                HeaderIdentifier = new HeaderIdentifier()
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

            var bytes = System.Convert.FromBase64String(Basic_Base64.STRING);
            var stream = new MemoryStream(bytes);

            var reader = new UniqueCommissionTypesReader(config);
            var commissionTypeValues = reader.Read(stream).ToList();

            Assert.Equal(3, commissionTypeValues.Count);
            Assert.Equal("val1;val3", commissionTypeValues[0]);
            Assert.Equal("val2;val3", commissionTypeValues[1]);
            Assert.Equal("val4;val6", commissionTypeValues[2]);
        }
    }
}
