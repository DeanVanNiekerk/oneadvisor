using FluentValidation;
using OneAdvisor.Model.Commission.Model.CommissionError;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionErrorValidator : AbstractValidator<CommissionError>
    {
        public CommissionErrorValidator()
        {
            RuleFor(c => c.CommissionStatementId).NotEmpty().WithName("Commission Statement");
            RuleFor(c => c.PolicyId).NotEmpty().WithName("Policy");
            RuleFor(c => c.ClientId).NotEmpty().WithName("Client");
            RuleFor(c => c.CommissionTypeId).NotEmpty().WithName("Commission Type");
        }
    }
}