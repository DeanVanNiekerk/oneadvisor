using OneAdvisor.Model;
using Xunit;

namespace OneAdvisor.Service.Test
{
    public class ExtensionMethodsTest
    {
        [Fact]
        public void Acronym_EmptyString()
        {
            var str = "";

            var acronym = str.Acronym();

            Assert.Equal("", acronym);
        }

        [Fact]
        public void Acronym_OneWord()
        {
            var str = "Dean";

            var acronym = str.Acronym();

            Assert.Equal("D", acronym);
        }

        [Fact]
        public void Acronym_TwoWords()
        {
            var str = "Dean john";

            var acronym = str.Acronym();

            Assert.Equal("DJ", acronym);
        }
    }
}