using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Model.Directory.Model.Application;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Service.Directory.Validators
{
    public class RoleValidator : AbstractValidator<RoleEdit>
    {
        public RoleValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty();
            RuleFor(o => o.Description).NotEmpty();
            RuleFor(o => o.ApplicationId).NotEmpty();
            RuleFor(o => o).Custom(HaveViewClientsPermission);
        }

        private void HaveViewClientsPermission(RoleEdit role, CustomContext context)
        {
            if (role.ApplicationId != Application.CLIENT_ID)
                return;

            if (!role.UseCaseIds.Contains("clt_view_clients"))
            {
                var failure = new ValidationFailure("UseCaseIds", "The 'View Clients' permission is required");
                context.AddFailure(failure);
            }
        }
    }
}