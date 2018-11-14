using FluentValidation;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserValidator: AbstractValidator<User>
    {
        public UserValidator() {

            RuleFor(u => u.Id).NotEmpty();
            RuleFor(u => u.FirstName).NotEmpty();
            RuleFor(u => u.LastName).NotEmpty();
        }
    }
}