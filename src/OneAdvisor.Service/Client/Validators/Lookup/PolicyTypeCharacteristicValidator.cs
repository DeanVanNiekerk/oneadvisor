using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Service.Client.Validators.Lookup
{
    public class PolicyTypeCharacteristicValidator : AbstractValidator<PolicyTypeCharacteristic>
    {
        private readonly DataContext _context;

        public PolicyTypeCharacteristicValidator(DataContext dataContext, bool isInsert)
        {
            _context = dataContext;

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(t => t.Name).NotEmpty();
            RuleFor(t => t.DisplayOrder).NotEmpty();
            RuleFor(t => t.PolicyTypeId).NotEmpty().WithName("Policy Type");
        }
    }
}