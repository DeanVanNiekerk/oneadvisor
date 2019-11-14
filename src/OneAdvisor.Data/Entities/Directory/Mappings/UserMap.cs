using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class UserMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var enumConverter = new EnumToStringConverter<Scope>();
            var jsonConverter = new JsonValueConverter<IEnumerable<string>>();

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Scope)
                .HasConversion(enumConverter);

            modelBuilder.Entity<UserEntity>()
                .Property(e => e.Aliases)
                .HasConversion(jsonConverter);

            modelBuilder.Entity<UserEntity>()
                .HasOne(u => u.Branch)
                .WithMany(b => b.Users)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserEntity>()
                .Property(u => u.UserTypeId)
                .HasDefaultValueSql($"'{UserType.BROKER.ToString()}'");
        }
    }
}