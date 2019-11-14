namespace OneAdvisor.Model.Account.Model.Account
{
    public class ResetPassword
    {
        public string UserName { get; set; }
        public string ConfirmPassword { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
    }
}