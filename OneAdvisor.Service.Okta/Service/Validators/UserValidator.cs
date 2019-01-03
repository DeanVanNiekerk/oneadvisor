using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Okta.Service.Validators
{
    public class UserValidator : AbstractValidator<UserEdit>
    {
        public UserValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(u => u.Id).NotEmpty();

            RuleFor(u => u.FirstName).NotEmpty();
            RuleFor(u => u.LastName).NotEmpty();
            RuleFor(u => u.BranchId).NotEmpty();
            RuleFor(u => u.Login).NotEmpty();
            RuleFor(u => u.Email).NotEmpty().EmailAddress();


            //Validation todo: 
            //is valid role
            //is valid organisation


            //RuleFor(u => u.Status).Must(BeAValidStatus).WithMessage("Must be a valid status");
        }

        // private bool BeAValidStatus(string status) {
        //     var statusList = new List<string>() {
        //         "ACTIVE",
        //         "STAGED",
        //         "PROVISIONED",
        //         "ACTIVE"
        //     };
        //     return statusList.Any(s => s == status);
        // }
    }
}