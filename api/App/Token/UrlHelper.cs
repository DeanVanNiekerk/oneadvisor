using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Config.Options;
using OneAdvisor.Model.Directory.Model.User;

namespace api.App.Token
{
    public class UrlHelper
    {
        public static string GenerateActivateLink(AppOptions appOptions, string token, UserEdit user)
        {
            return $"{appOptions.BaseUrl}/activate?username={System.Net.WebUtility.UrlEncode(user.UserName)}&token={System.Net.WebUtility.UrlEncode(token)}";
        }

        public static string GenerateResetPasswordLink(AppOptions appOptions, string token, string userName)
        {
            return $"{appOptions.BaseUrl}/resetPassword?username={System.Net.WebUtility.UrlEncode(userName)}&token={System.Net.WebUtility.UrlEncode(token)}";
        }
    }
}