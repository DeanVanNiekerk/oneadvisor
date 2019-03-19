
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Service.Common;

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
        }
    }
}