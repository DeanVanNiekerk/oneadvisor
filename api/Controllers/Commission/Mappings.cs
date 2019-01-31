using api.Controllers.Commission.Commissions.Dto;
using AutoMapper;
using OneAdvisor.Model.Commission.Model.Commission;

namespace api.Controllers.Commission
{
    public class Mappings
    {
        public static void Configure(IMapperConfigurationExpression config)
        {
            config.CreateMap<OneAdvisor.Model.Commission.Model.Commission.Commission, CommissionDto>();
            config.CreateMap<CommissionEdit, CommissionEditDto>();
        }
    }
}