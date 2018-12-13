using AutoMapper;

namespace api.App.Setup
{
    public class MappingSetup
    {
        public static IMapper ConfigureMappings()
        {
            var mapperConfiguration = new MapperConfiguration(config =>
            {
                Controllers.Directory.Mappings.Configure(config);
                Controllers.Member.Mappings.Configure(config);
            });

            //Should possibly only do this in dev
            mapperConfiguration.AssertConfigurationIsValid();

            return mapperConfiguration.CreateMapper();
        }

    }
}