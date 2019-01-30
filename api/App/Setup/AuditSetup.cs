using System;
using api.App.Authorization;
using Audit.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data.Entities.Directory;

namespace api.App.Setup
{
    public class AuditSetup
    {
        public AuditSetup(IServiceCollection services)
        {
            Services = services;
        }

        private IServiceCollection Services { get; }

        public void Setup()
        {
            //https://github.com/thepirat000/Audit.NET/tree/master/src/Audit.EntityFramework

            Audit.Core.Configuration.Setup()
               .UseEntityFramework(_ => _
                   .AuditTypeMapper(t => typeof(AuditLogEntity))
                   .AuditEntityAction<AuditLogEntity>((ev, entry, entity) =>
                   {
                       entity.AuditData = entry.ToJson();
                       entity.EntityType = entry.EntityType.Name;
                       entity.AuditDate = DateTime.Now;
                       entity.AuditUser = Context.GetUserId(Services.BuildServiceProvider().GetService<IHttpContextAccessor>().HttpContext.User);
                   })
               .IgnoreMatchedProperties(true));
        }
    }
}