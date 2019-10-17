using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseUrls("https://localhost:6001")
                .UseStartup<Startup>();
    }
}
