using FluentValidation;
using OneAdvisor.Model.Directory.Model.ChangeLog;

namespace OneAdvisor.Service.Directory.Validators
{
    public class ChangeLogValidator : AbstractValidator<ChangeLog>
    {
        public ChangeLogValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.VersionNumber).NotEmpty().MaximumLength(10).WithName("Version Number");
            RuleFor(o => o.ReleaseDate).NotEmpty().WithName("Release Date");
            RuleFor(o => o.Log).NotEmpty().NotEmpty();
        }
    }
}