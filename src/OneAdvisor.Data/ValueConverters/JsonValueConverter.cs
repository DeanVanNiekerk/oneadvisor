using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace OneAdvisor.Data.ValueConverters
{
    public class JsonValueConverter<TEntity> : ValueConverter<TEntity, string>
    {
        public JsonValueConverter(JsonSerializerOptions serializerOptions = null,
                                  ConverterMappingHints mappingHints = null)
            : base(model => JsonSerializer.Serialize(model, serializerOptions),
                   value => JsonSerializer.Deserialize<TEntity>(value, serializerOptions),
                   mappingHints)
        { }

        public static ValueConverter Default { get; } =
            new JsonValueConverter<TEntity>(null, null);

        public static ValueConverterInfo DefaultInfo { get; } =
            new ValueConverterInfo(typeof(TEntity),
                typeof(string),
                i => new JsonValueConverter<TEntity>(null, i.MappingHints));
    }
}