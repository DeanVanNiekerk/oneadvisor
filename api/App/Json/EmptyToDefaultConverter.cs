using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.App.Json
{
    public class EmptyToDefaultConverter<T> : JsonConverter where T : struct
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(T);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if ((string)reader.Value == "")
                return default(T);

            var token = JToken.Load(reader);
            return token.ToObject(objectType);
        }

        // Return false instead if you don't want default values to be written as null
        public override bool CanWrite { get { return true; } }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (EqualityComparer<T>.Default.Equals((T)value, default(T)))
                writer.WriteValue("");
            else
                writer.WriteValue(value);
        }
    }
}