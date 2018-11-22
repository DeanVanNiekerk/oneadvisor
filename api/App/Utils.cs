using System.Linq;
using api.App.Dtos;
using AutoMapper;
using OneAdvisor.Model.Common;

namespace api
{
    public class Utils
    {
        public static PagedItemsDto<T> MapToPageItemsDto<S, T>(IMapper Mapper, PagedItems<S> pagedItems) 
        {
            return new PagedItemsDto<T>() 
            {
                TotalItems = pagedItems.TotalItems,
                Items = pagedItems.Items.Select(u => Mapper.Map<T>(u))
            };
        }
    }
}