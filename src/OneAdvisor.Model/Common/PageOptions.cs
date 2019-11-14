
namespace OneAdvisor.Model.Common
{
    public class PageOptions
    {
        public PageOptions(int size, int number) 
        {
            Number = number;
            Size = size;
        }

        public int Number { get; private set; }
        public int Size { get; private set; }
    }
}