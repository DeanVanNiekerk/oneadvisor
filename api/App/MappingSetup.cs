

using AutoMapper;

namespace api
{
    public class MappingSetup
    {
        public static IMapper ConfigureMappings()
        {
            var mapperConfiguration = new MapperConfiguration(config =>
            {
                Controllers.Directory.Mappings.Configure(config);
            });

            //Should possibly only do this in dev
            mapperConfiguration.AssertConfigurationIsValid();

            return mapperConfiguration.CreateMapper();
        }
       
    }
}