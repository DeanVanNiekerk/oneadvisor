
namespace OneAdvisor.Model.Account.Model.Authentication
{
    public class AuthenticationResult
    {
        public AuthenticationResult()
        {
            Success = false;
            IsLocked = false;
            NotActivated = false;
        }

        public bool Success { get; set; }
        public bool IsLocked { get; set; }
        public bool NotActivated { get; set; }
    }
}