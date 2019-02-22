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

            // Audit.Core.Configuration.Setup()
            //    .UseEntityFramework(_ => _
            //        .AuditTypeMapper(t => typeof(AuditLogEntity))
            //        .AuditEntityAction<AuditLogEntity>((ev, entry, entity) =>
            //        {
            //            entity.Data = entry.ToJson();
            //            entity.Entity = entry.EntityType.Name;
            //            entity.Action = entry.Action;
            //            entity.Date = DateTime.Now;
            //            entity.UserId = Guid.Parse(Services.BuildServiceProvider().GetService<IHttpContextAccessor>().HttpContext.User.Identity.Name);
            //        })
            //    .IgnoreMatchedProperties(true));
        }
    }
}