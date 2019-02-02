using api.App.Dtos;

namespace api.Controllers.Commission.Commissions.Dto
{
    public class PagedCommissionsDto : PagedItemsDto<CommissionDto>
    {
        public decimal SumAmountIncludingVAT { get; set; }
        public decimal SumVAT { get; set; }
        public decimal AverageAmountIncludingVAT { get; set; }
        public decimal AverageVAT { get; set; }
    }
}