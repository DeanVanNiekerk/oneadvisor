using System;

namespace api.App
{
    public class Utils
    {
        public static string GetEnvironment()
        {
            return Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        }
    }
}