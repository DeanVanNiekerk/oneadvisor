
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionAllocationValidator : AbstractValidator<CommissionAllocationEdit>
    {
        public CommissionAllocationValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.FromClientId).NotEmpty().WithName("From Client");
            RuleFor(o => o.ToClientId).NotEmpty().WithName("To Client");
        }
    }
}