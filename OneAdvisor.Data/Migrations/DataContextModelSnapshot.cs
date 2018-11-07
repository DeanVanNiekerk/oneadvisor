﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OneAdvisor.Data;

namespace OneAdvisor.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.ApplicationEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("dir_Application");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.RoleEntity", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(32);

                    b.Property<Guid>("ApplicationId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.ToTable("dir_Role");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.RoleToUseCaseEntity", b =>
                {
                    b.Property<string>("RoleId")
                        .HasMaxLength(32);

                    b.Property<string>("UseCaseId")
                        .HasMaxLength(32);

                    b.HasKey("RoleId", "UseCaseId");

                    b.HasIndex("UseCaseId");

                    b.ToTable("dir_RoleToUseCase");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.UseCaseEntity", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(32);

                    b.Property<Guid>("ApplicationId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.ToTable("dir_UseCase");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.RoleEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.ApplicationEntity", "Application")
                        .WithMany()
                        .HasForeignKey("ApplicationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.RoleToUseCaseEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.RoleEntity", "Role")
                        .WithMany("RoleToUseCases")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("OneAdvisor.Data.Entities.Directory.UseCaseEntity", "UseCase")
                        .WithMany("RoleToUseCases")
                        .HasForeignKey("UseCaseId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.UseCaseEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.ApplicationEntity", "Application")
                        .WithMany()
                        .HasForeignKey("ApplicationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
