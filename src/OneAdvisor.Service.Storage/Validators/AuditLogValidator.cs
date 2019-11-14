using FluentValidation;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Storage.Validators
{
    public class AuditLogValidator : AbstractValidator<AuditLog>
    {
        public AuditLogValidator()
        {
            RuleFor(o => o.Action).NotEmpty();
        }
    }
}