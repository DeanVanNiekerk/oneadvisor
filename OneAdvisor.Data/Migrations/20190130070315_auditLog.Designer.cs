﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OneAdvisor.Data;

namespace OneAdvisor.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20190130070315_auditLog")]
    partial class auditLog
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
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

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.AuditLogEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AuditData");

                    b.Property<DateTime>("AuditDate");

                    b.Property<string>("AuditUser");

                    b.Property<string>("EntityType");

                    b.HasKey("Id");

                    b.ToTable("dir_AuditLog");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.BranchEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<Guid>("OrganisationId");

                    b.HasKey("Id");

                    b.HasIndex("OrganisationId");

                    b.ToTable("dir_Branch");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.Lookup.CommissionTypeEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("lkp_CommissionType");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.Lookup.CompanyEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("lkp_Company");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.Lookup.ContactTypeEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("lkp_ContactType");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.Lookup.MarritalStatusEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("lkp_MarritalStatus");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.Lookup.PolicyTypeEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("lkp_PolicyType");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.OrganisationEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("dir_Organisation");
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

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.UserEntity", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Aliases")
                        .IsRequired();

                    b.Property<Guid>("BranchId");

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<string>("LastName")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("BranchId");

                    b.ToTable("dir_User");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Member.ContactEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ContactTypeId");

                    b.Property<Guid>("MemberId");

                    b.Property<string>("Value")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ContactTypeId");

                    b.HasIndex("MemberId");

                    b.ToTable("mem_Contact");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Member.MemberEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("DateOfBirth");

                    b.Property<string>("FirstName");

                    b.Property<string>("IdNumber");

                    b.Property<string>("Initials");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("LastName");

                    b.Property<string>("MaidenName");

                    b.Property<DateTime?>("MarriageDate");

                    b.Property<Guid?>("MarritalStatusId");

                    b.Property<Guid>("OrganisationId");

                    b.Property<string>("PassportNumber");

                    b.Property<string>("PreferredName");

                    b.Property<string>("TaxNumber");

                    b.HasKey("Id");

                    b.HasIndex("MarritalStatusId");

                    b.HasIndex("OrganisationId");

                    b.ToTable("mem_Member");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Member.PolicyEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("CompanyId");

                    b.Property<Guid>("MemberId");

                    b.Property<string>("Number")
                        .IsRequired();

                    b.Property<Guid?>("PolicyTypeId");

                    b.Property<decimal?>("Premium")
                        .HasColumnType("Money");

                    b.Property<DateTime?>("StartDate");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("MemberId");

                    b.HasIndex("PolicyTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("mem_Policy");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.BranchEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.OrganisationEntity", "Organisation")
                        .WithMany("Branches")
                        .HasForeignKey("OrganisationId")
                        .OnDelete(DeleteBehavior.Cascade);
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

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.UserEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.BranchEntity", "Branch")
                        .WithMany()
                        .HasForeignKey("BranchId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Member.ContactEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.ContactTypeEntity", "ContactType")
                        .WithMany()
                        .HasForeignKey("ContactTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Member.MemberEntity", "Member")
                        .WithMany("MemberContacts")
                        .HasForeignKey("MemberId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Member.MemberEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.MarritalStatusEntity", "MarritalStatus")
                        .WithMany()
                        .HasForeignKey("MarritalStatusId");

                    b.HasOne("OneAdvisor.Data.Entities.Directory.OrganisationEntity", "Organisation")
                        .WithMany("Members")
                        .HasForeignKey("OrganisationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Member.PolicyEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.CompanyEntity", "Company")
                        .WithMany("MemberPolicies")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Member.MemberEntity", "Member")
                        .WithMany("MemberPolicies")
                        .HasForeignKey("MemberId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.PolicyTypeEntity", "PolicyType")
                        .WithMany()
                        .HasForeignKey("PolicyTypeId");

                    b.HasOne("OneAdvisor.Data.Entities.Directory.UserEntity", "User")
                        .WithMany("MemberPolicies")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
