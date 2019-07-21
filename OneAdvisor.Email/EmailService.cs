using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentEmail.Core;
using Microsoft.Extensions.Options;
using OneAdvisor.Email.Templates.Commission;
using OneAdvisor.Email.Templates.Directory;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Config.Options;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Email;
using OneAdvisor.Model.Email.Model;

namespace OneAdvisor.Email
{
    public class EmailService : IEmailService
    {
        private IFluentEmail _email;
        private EmailOptions _options;

        public EmailService(IFluentEmail email, IOptions<EmailOptions> options)
        {
            _email = email;
            _options = options.Value;
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

        public async Task<Result> SendImportCommissionUnknownCommissionTypesEmail(
            string environment,
            Organisation organisation,
            UserEdit user,
            Company company,
            CommissionStatementEdit statement,
            CommissionStatementTemplateEdit template,
            List<string> unknownCommissionTypes,
            Attachment attachment)
        {
            var result = new Result();

            var response = await _email
                .To(_options.Emails.CommissionImportAlerts.To)
                .Subject("One Advisor - ALERT: Unknown Commission Types Found")
                .UsingTemplate(ImportUnknownCommissionTypes.Template,
                    new
                    {
                        Environment = environment,
                        OrganisationName = organisation.Name,
                        UserFirstName = user.FirstName,
                        UserLastName = user.LastName,
                        Username = user.UserName,
                        UserEmail = user.Email,
                        CompanyName = company.Name,
                        StatementDate = statement.Date.Value.ToLongDateString(),
                        StatementStatus = statement.Processed.Value ? "Processed" : "Processing",
                        StatementTemplateName = template.Name,
                        CommissionTypes = unknownCommissionTypes
                    }
                )
                .Attach(new FluentEmail.Core.Models.Attachment()
                {
                    Filename = attachment.FileName,
                    ContentType = attachment.ContentType,
                    Data = attachment.Data
                })
                .SendAsync();

            result.Success = response.Successful;

            if (!result.Success)
            {
                result.Errors = response.ErrorMessages;
                return result;
            }

            return result;
        }

        public async Task<Result> SendImportCommissionZeroEntriesEmail(
            string environment,
            Organisation organisation,
            UserEdit user,
            Company company,
            CommissionStatementEdit statement,
            CommissionStatementTemplateEdit template,
            Attachment attachment)
        {
            var result = new Result();

            var response = await _email
                .To(_options.Emails.CommissionImportAlerts.To)
                .Subject("One Advisor - ALERT: Zero Commission Entries Imported")
                .UsingTemplate(ImportCommissionZeroEntries.Template,
                    new
                    {
                        Environment = environment,
                        OrganisationName = organisation.Name,
                        UserFirstName = user.FirstName,
                        UserLastName = user.LastName,
                        Username = user.UserName,
                        UserEmail = user.Email,
                        CompanyName = company.Name,
                        StatementDate = statement.Date.Value.ToLongDateString(),
                        StatementStatus = statement.Processed.Value ? "Processed" : "Processing",
                        StatementTemplateName = template.Name
                    }
                )
                .Attach(new FluentEmail.Core.Models.Attachment()
                {
                    Filename = attachment.FileName,
                    ContentType = attachment.ContentType,
                    Data = attachment.Data
                })
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
