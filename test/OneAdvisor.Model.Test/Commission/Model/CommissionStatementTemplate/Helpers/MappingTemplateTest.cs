using System;
using Xunit;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Helpers;

namespace OneAdvisor.Model.Test.Commission.Model.CommissionStatementTemplate.Helpers
{
    public class MappingTemplateTest
    {
        [Fact]
        public void GetColumn_NoSubstring()
        {
            var column = "D";

            var actual = MappingTemplate.GetColumn(column);

            Assert.Equal(column, actual);
        }

        [Fact]
        public void GetColumn_HasSubstring()
        {
            var column = "D(1-3)";

            var actual = MappingTemplate.GetColumn(column);

            Assert.Equal("D", actual);
        }

        [Fact]
        public void GetSubStringIndex_NoSubstring()
        {
            var column = "D";

            var actual = MappingTemplate.GetSubStringIndex(column);

            Assert.Empty(actual);
        }

        [Fact]
        public void GetSubStringIndex_HasSubstring()
        {
            var column = "D(1-3)";

            var actual = MappingTemplate.GetSubStringIndex(column);

            Assert.Equal(2, actual.Count);
            Assert.Equal(1, actual[0]);
            Assert.Equal(3, actual[1]);
        }

        [Fact]
        public void GetSubStringIndex_HasSubstring_DoubleDigit()
        {
            var column = "D(1-15)";

            var actual = MappingTemplate.GetSubStringIndex(column);

            Assert.Equal(2, actual.Count);
            Assert.Equal(1, actual[0]);
            Assert.Equal(15, actual[1]);
        }
    }
}