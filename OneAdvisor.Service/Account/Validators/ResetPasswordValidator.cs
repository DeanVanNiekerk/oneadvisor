using FluentValidation;
using OneAdvisor.Model.Account.Model.Account;

namespace OneAdvisor.Service.Account.Validators
{
    public class ResetPasswordValidator : AbstractValidator<ResetPassword>
    {
        public ResetPasswordValidator()
        {
            RuleFor(o => o.UserName).NotEmpty();
            RuleFor(o => o.Password).NotEmpty();
            RuleFor(o => o.ConfirmPassword).NotEmpty().WithName("Confirm Password");

            RuleFor(o => o.ConfirmPassword).Equal(o => o.Password).WithMessage("Password and Confirm Password do not match");
        }
    }
}