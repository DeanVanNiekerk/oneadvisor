using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using api.App.Dtos;
using api.App.Middleware;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Role;

namespace api
{
    public static class ExtensionMethods
    {
        public static IApplicationBuilder UseMaintainCorsHeader(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MaintainCorsHeader>();
        }

        public static PagedItemsDto<T> MapToPageItemsDto<S, T>(this IMapper Mapper, PagedItems<S> pagedItems)
        {
            return new PagedItemsDto<T>()
            {
                TotalItems = pagedItems.TotalItems,
                Items = pagedItems.Items.Select(u => Mapper.Map<T>(u))
            };
        }

        public static List<T> MapList<S, T>(this IMapper Mapper, List<S> s)
        {
            return Mapper.Map<List<S>, List<T>>(s);
        }

        public static bool IsSuperAdmin(this ClaimsPrincipal principal)
        {
            var roles = principal.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

            return roles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE);
        }
    }
}