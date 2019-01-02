namespace OneAdvisor.Model.Directory.Model.User
{
    public enum Scope
    {
        Organisation = 1,
        Branch = 2,
        User = 3
    }

    public class ScopeParser
    {
        public static Scope Parse(string scope)
        {
            switch (scope)
            {
                case "organisation":
                    return Scope.Organisation;
                case "branch":
                    return Scope.Branch;
                default:
                    return Scope.User;
            }
        }

        public static string Format(Scope scope)
        {
            switch (scope)
            {
                case Scope.Organisation:
                    return "organisation";
                case Scope.Branch:
                    return "branch";
                default:
                    return "user";
            }
        }
    }


}