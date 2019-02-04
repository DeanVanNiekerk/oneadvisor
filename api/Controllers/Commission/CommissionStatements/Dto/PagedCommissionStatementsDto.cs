using api.App.Dtos;

namespace api.Controllers.Commission.CommissionStatements.Dto
{
    public class PagedCommissionStatementsDto : PagedItemsDto<CommissionStatementDto>
    {
        public decimal SumAmountIncludingVAT { get; set; }
        public decimal SumVAT { get; set; }
        public decimal AverageAmountIncludingVAT { get; set; }
        public decimal AverageVAT { get; set; }
    }
}