using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Model.User;

namespace api.App.Token
{
    public class UrlHelper
    {
        public static string GenerateResetPasswordLink(string token, UserEdit user, HttpRequest request)
        {
            var host = request.Host.ToString();

            //If the website is under root and has a base path then use following route
            if (request.PathBase != null)
                host = $"{host}{request.PathBase}";

            //If the website is not rooted
            return $"{request.Scheme}://{host}/resetpassword?username={System.Net.WebUtility.UrlEncode(user.UserName)}&code={System.Net.WebUtility.UrlEncode(token)}";
        }
    }
}