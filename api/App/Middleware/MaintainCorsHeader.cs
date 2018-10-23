using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace api.App.Middleware
{
    public class MaintainCorsHeader
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<MaintainCorsHeader> _logger;

        public MaintainCorsHeader(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = loggerFactory?.CreateLogger<MaintainCorsHeader>() ?? throw new ArgumentNullException(nameof(loggerFactory));
        }

        public async Task Invoke(HttpContext httpContext)
        {
            // Find and hold onto any CORS related headers ...
            var corsHeaders = new HeaderDictionary();
            foreach (var pair in httpContext.Response.Headers)
            {
                if (!pair.Key.ToLower().StartsWith("access-control-")) { continue; } // Not CORS related
                corsHeaders[pair.Key] = pair.Value;
            }

            // Bind to the OnStarting event so that we can make sure these CORS headers are still included going to the client
            httpContext.Response.OnStarting(o =>
            {
                var ctx = (HttpContext)o;
                var headers = ctx.Response.Headers;
                // Ensure all CORS headers remain or else add them back in ...
                foreach (var pair in corsHeaders)
                {
                    if (headers.ContainsKey(pair.Key)) { continue; } // Still there!
                    headers.Add(pair.Key, pair.Value);
                }
                return Task.CompletedTask;
            }, httpContext);

            // Call the pipeline ...
            await _next(httpContext);
        }
    }
}