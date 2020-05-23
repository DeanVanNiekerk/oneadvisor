namespace OneAdvisor.Import.Excel.Test.Readers.UniqueCommissionTypes.Source
{
    public class Formatter_Base64
    {
        public static readonly string STRING = @"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";
    }
}