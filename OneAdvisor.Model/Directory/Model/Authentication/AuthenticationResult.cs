using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Model.Authentication
{
    public class AuthenticationResult
    {
        public AuthenticationResult()
        {
            Success = false;
        }

        public bool Success { get; set; }
        public Identity Identity { get; set; }
    }
}