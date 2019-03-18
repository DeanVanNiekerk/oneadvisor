using System;
using System.Threading.Tasks;
using FluentEmail.Core;
using OneAdvisor.Email.Templates;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Email;

namespace OneAdvisor.Email
{
    public class EmailService : IEmailService
    {
        private IFluentEmail _email;

        public EmailService(IFluentEmail email)
        {
            _email = email;
        }

        public async Task<Result> SendWelcomeEmail(UserEdit user, string activateUrl)
        {
            var result = new Result();

            var response = await _email
                .To(user.Email)
                .Subject("Welcome to One Advisor")
                .UsingTemplate(Welcome.Template, new { FirstName = user.FirstName.ToUpper(), UserName = user.UserName, ActivateUrl = activateUrl })
                .SendAsync();

            result.Success = response.Successful;

            if (!result.Success)
            {
                result.Errors = response.ErrorMessages;
                return result;
            }

            return result;
        }

        public async Task<Result> SendResetPasswordEmail(UserEdit user, string resetPasswordUrl)
        {
            var result = new Result();

            var response = await _email
                .To(user.Email)
                .Subject("One Advisor - Reset Password")
                .UsingTemplate(ResetPassword.Template, new { FirstName = user.FirstName, ResetPasswordUrl = resetPasswordUrl })
                .SendAsync();

            result.Success = response.Successful;

            if (!result.Success)
            {
                result.Errors = response.ErrorMessages;
                return result;
            }

            return result;
        }
    }
}
