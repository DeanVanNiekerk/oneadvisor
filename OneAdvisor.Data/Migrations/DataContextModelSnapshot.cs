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
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<Guid>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<Guid>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<Guid>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<Guid>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("AmountIncludingVAT")
                        .HasColumnType("Money");

                    b.Property<Guid>("CommissionStatementId");

                    b.Property<Guid>("CommissionTypeId");

                    b.Property<Guid>("PolicyId");

                    b.Property<decimal>("VAT")
                        .HasColumnType("Money");

                    b.HasKey("Id");

                    b.HasIndex("CommissionStatementId");

                    b.HasIndex("CommissionTypeId");

                    b.HasIndex("PolicyId");

                    b.ToTable("com_Commission");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionErrorEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("CommissionStatementId");

                    b.Property<Guid?>("CommissionTypeId");

                    b.Property<string>("Data")
                        .IsRequired();

                    b.Property<bool>("IsFormatValid");

                    b.Property<Guid?>("MemberId");

                    b.Property<Guid?>("PolicyId");

                    b.HasKey("Id");

                    b.HasIndex("CommissionStatementId");

                    b.HasIndex("MemberId");

                    b.HasIndex("PolicyId");

                    b.ToTable("com_CommissionError");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionStatementEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("AmountIncludingVAT")
                        .HasColumnType("Money");

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("Date");

                    b.Property<Guid>("OrganisationId");

                    b.Property<bool>("Processed");

                    b.Property<decimal>("VAT")
                        .HasColumnType("Money");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("OrganisationId");

                    b.ToTable("com_CommissionStatement");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionStatementTemplateEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("CompanyId");

                    b.Property<string>("Config")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("com_CommissionStatementTemplate");
                });

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

                    b.Property<string>("Action");

                    b.Property<string>("Data");

                    b.Property<DateTime>("Date");

                    b.Property<string>("Entity");

                    b.Property<Guid>("UserId");

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

                    b.Property<string>("Code")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<Guid>("PolicyTypeId");

                    b.HasKey("Id");

                    b.HasIndex("Code")
                        .IsUnique();

                    b.HasIndex("PolicyTypeId");

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
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("ApplicationId");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Description")
                        .IsRequired();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.RoleToUseCaseEntity", b =>
                {
                    b.Property<Guid>("RoleId")
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
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("Aliases")
                        .IsRequired();

                    b.Property<Guid>("BranchId");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<string>("LastName")
                        .IsRequired();

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("Scope")
                        .IsRequired();

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");
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

                    b.Property<Guid>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("MemberId");

                    b.HasIndex("PolicyTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("mem_Policy");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.RoleEntity")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.UserEntity")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.UserEntity")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.RoleEntity")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Directory.UserEntity")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.UserEntity")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Commission.CommissionStatementEntity", "CommissionStatement")
                        .WithMany("Commissions")
                        .HasForeignKey("CommissionStatementId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.CommissionTypeEntity", "CommissionType")
                        .WithMany()
                        .HasForeignKey("CommissionTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Member.PolicyEntity", "Policy")
                        .WithMany()
                        .HasForeignKey("PolicyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionErrorEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Commission.CommissionStatementEntity", "CommissionStatement")
                        .WithMany("CommissionErrors")
                        .HasForeignKey("CommissionStatementId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Member.MemberEntity", "Member")
                        .WithMany()
                        .HasForeignKey("MemberId");

                    b.HasOne("OneAdvisor.Data.Entities.Member.PolicyEntity", "Policy")
                        .WithMany()
                        .HasForeignKey("PolicyId");
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Commission.CommissionStatementEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.CompanyEntity", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("OneAdvisor.Data.Entities.Directory.OrganisationEntity", "Organisation")
                        .WithMany()
                        .HasForeignKey("OrganisationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.BranchEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.OrganisationEntity", "Organisation")
                        .WithMany("Branches")
                        .HasForeignKey("OrganisationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.Lookup.CommissionTypeEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.Lookup.PolicyTypeEntity", "PolicyType")
                        .WithMany("CommissionTypes")
                        .HasForeignKey("PolicyTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OneAdvisor.Data.Entities.Directory.RoleEntity", b =>
                {
                    b.HasOne("OneAdvisor.Data.Entities.Directory.ApplicationEntity", "Application")
                        .WithMany()
                        .HasForeignKey("ApplicationId");
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
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
