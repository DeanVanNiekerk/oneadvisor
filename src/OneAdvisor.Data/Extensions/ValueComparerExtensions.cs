using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OneAdvisor.Data
{
    public static class ValueComparerExtensions
    {
        public static PropertyBuilder<T> HasJsonComparer<T>(this PropertyBuilder<T> propertyBuilder)
        {
            ValueComparer<T> comparer = new ValueComparer<T>
            (
                (l, r) => JsonSerializer.Serialize(l, null) == JsonSerializer.Serialize(r, null),
                v => v == null ? 0 : JsonSerializer.Serialize(v, null).GetHashCode(),
                v => JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(v, null), null)
            );

            propertyBuilder.Metadata.SetValueComparer(comparer);

            return propertyBuilder;
        }
    }
}