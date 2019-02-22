using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class UserMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var converter = new EnumToStringConverter<Scope>();

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Scope)
                .HasConversion(converter);

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Aliases)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<IList<string>>(v));
        }
    }
}