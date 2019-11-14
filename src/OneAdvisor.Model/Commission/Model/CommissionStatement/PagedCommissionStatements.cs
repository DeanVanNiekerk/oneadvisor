using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Model.CommissionStatement
{
    public class PagedCommissionStatements : PagedItems<CommissionStatement>
    {
        public decimal SumAmountIncludingVAT { get; set; }
        public decimal SumVAT { get; set; }
    }
}