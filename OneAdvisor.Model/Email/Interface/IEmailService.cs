using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Email.Model;

namespace OneAdvisor.Model.Email
{
    public interface IEmailService
    {
        Task<Result> SendWelcomeEmail(UserEdit user, string activateUrl);
        Task<Result> SendResetPasswordEmail(UserEdit user, string resetPasswordUrl);
        Task<Result> SendImportCommissionUnknownCommissionTypesEmail(
            string environment,
            Organisation organisation,
            UserEdit user,
            Company company,
            CommissionStatementEdit statement,
            CommissionStatementTemplateEdit template,
            List<string> unknownCommissionTypes,
            Attachment attachment);
        Task<Result> SendImportCommissionZeroEntriesEmail(
            string environment,
            Organisation organisation,
            UserEdit user,
            Company company,
            CommissionStatementEdit statement,
            CommissionStatementTemplateEdit template,
            Attachment attachment);
    }
}