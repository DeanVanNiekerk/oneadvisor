using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Directory.Model.User.Configuration;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class UserMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var enumConverter = new EnumToStringConverter<Scope>();
            var jsonListStringConverter = new JsonValueConverter<IEnumerable<string>>();
            var jsonConfigConverter = new JsonValueConverter<Config>();

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Scope)
                .HasConversion(enumConverter);

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Aliases)
                .HasConversion(jsonListStringConverter)
                .HasJsonComparer();

            modelBuilder.Entity<UserEntity>()
                .HasOne(u => u.Branch)
                .WithMany(b => b.Users)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserEntity>()
                .Property(u => u.UserTypeId)
                .HasDefaultValueSql($"'{UserType.BROKER.ToString()}'");

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Config)
                .HasConversion(jsonConfigConverter)
                .HasDefaultValueSql("'{ }'");
        }
    }
}