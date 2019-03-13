using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class PagedCommissions : PagedItems<Commission>
    {
        public decimal SumAmountIncludingVAT { get; set; }
        public decimal SumVAT { get; set; }
    }
}