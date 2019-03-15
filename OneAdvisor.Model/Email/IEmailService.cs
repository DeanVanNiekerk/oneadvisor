using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Email
{
    public interface IEmailService
    {
        Task<Result> SendWelcomeEmail(UserEdit user, string activateUrl);
    }
}