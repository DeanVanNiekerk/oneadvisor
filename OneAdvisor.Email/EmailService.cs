using System;
using System.Threading.Tasks;
using FluentEmail.Core;
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

        public async Task<Result> SendWelcomeEmail(UserEdit user)
        {
            var result = new Result();

            var response = await _email
                .To(user.Email)
                .Subject("Welcome to One Advisor")
                .Body("This is the email body")
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
