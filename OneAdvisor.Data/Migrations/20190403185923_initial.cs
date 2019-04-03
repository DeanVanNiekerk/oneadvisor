using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "clt_ClientType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Code = table.Column<string>(nullable: false),
                    DisplayOrder = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_ClientType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "clt_ContactType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_ContactType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "clt_MarritalStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_MarritalStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "clt_PolicyType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Code = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_PolicyType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "com_CommissionEarningsType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionEarningsType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "com_CommissionStatementTemplate",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Config = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionStatementTemplate", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_Application",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_Application", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_AuditLog",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Data = table.Column<string>(nullable: true),
                    Entity = table.Column<string>(nullable: true),
                    Action = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_AuditLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_Company",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    CommissionPolicyNumberPrefixes = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_Company", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_Organisation",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_Organisation", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "idn_User",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    BranchId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: false),
                    Aliases = table.Column<string>(nullable: false),
                    Scope = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "clt_PolicyProductType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PolicyTypeId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Code = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_PolicyProductType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_PolicyProductType_clt_PolicyType_PolicyTypeId",
                        column: x => x.PolicyTypeId,
                        principalTable: "clt_PolicyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "com_CommissionType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PolicyTypeId = table.Column<Guid>(nullable: false),
                    CommissionEarningsTypeId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Code = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_CommissionType_com_CommissionEarningsType_CommissionEarningsTypeId",
                        column: x => x.CommissionEarningsTypeId,
                        principalTable: "com_CommissionEarningsType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_CommissionType_clt_PolicyType_PolicyTypeId",
                        column: x => x.PolicyTypeId,
                        principalTable: "clt_PolicyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dir_UseCase",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 256, nullable: false),
                    Name = table.Column<string>(nullable: false),
                    ApplicationId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_UseCase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_UseCase_dir_Application_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "dir_Application",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "idn_Role",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    ApplicationId = table.Column<Guid>(nullable: true),
                    Description = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_Role", x => x.Id);
                    table.ForeignKey(
                        name: "FK_idn_Role_dir_Application_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "dir_Application",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "clt_Client",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    OrganisationId = table.Column<Guid>(nullable: false),
                    ClientTypeId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    MaidenName = table.Column<string>(nullable: true),
                    Initials = table.Column<string>(nullable: true),
                    PreferredName = table.Column<string>(nullable: true),
                    IdNumber = table.Column<string>(nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: true),
                    AlternateIdNumber = table.Column<string>(nullable: true),
                    TaxNumber = table.Column<string>(nullable: true),
                    MarritalStatusId = table.Column<Guid>(nullable: true),
                    MarriageDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_Client", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_Client_clt_ClientType_ClientTypeId",
                        column: x => x.ClientTypeId,
                        principalTable: "clt_ClientType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clt_Client_clt_MarritalStatus_MarritalStatusId",
                        column: x => x.MarritalStatusId,
                        principalTable: "clt_MarritalStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_clt_Client_dir_Organisation_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "dir_Organisation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "com_CommissionStatement",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    OrganisationId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    AmountIncludingVAT = table.Column<decimal>(type: "Money", nullable: false),
                    VAT = table.Column<decimal>(type: "Money", nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    DateMonth = table.Column<int>(nullable: false),
                    DateYear = table.Column<int>(nullable: false),
                    Processed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionStatement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_CommissionStatement_dir_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "dir_Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_CommissionStatement_dir_Organisation_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "dir_Organisation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dir_Branch",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    OrganisationId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_Branch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_Branch_dir_Organisation_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "dir_Organisation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "idn_UserClaim",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_UserClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_idn_UserClaim_idn_User_UserId",
                        column: x => x.UserId,
                        principalTable: "idn_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "idn_UserLogin",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_UserLogin", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_idn_UserLogin_idn_User_UserId",
                        column: x => x.UserId,
                        principalTable: "idn_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "idn_UserToken",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_UserToken", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_idn_UserToken_idn_User_UserId",
                        column: x => x.UserId,
                        principalTable: "idn_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "clt_PolicyProduct",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PolicyProductTypeId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Code = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_PolicyProduct", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_PolicyProduct_dir_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "dir_Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clt_PolicyProduct_clt_PolicyProductType_PolicyProductTypeId",
                        column: x => x.PolicyProductTypeId,
                        principalTable: "clt_PolicyProductType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dir_RoleToUseCase",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(maxLength: 32, nullable: false),
                    UseCaseId = table.Column<string>(maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_RoleToUseCase", x => new { x.RoleId, x.UseCaseId });
                    table.ForeignKey(
                        name: "FK_dir_RoleToUseCase_idn_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "idn_Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_dir_RoleToUseCase_dir_UseCase_UseCaseId",
                        column: x => x.UseCaseId,
                        principalTable: "dir_UseCase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "idn_RoleClaim",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_RoleClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_idn_RoleClaim_idn_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "idn_Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "idn_UserRole",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_idn_UserRole", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_idn_UserRole_idn_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "idn_Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_idn_UserRole_idn_User_UserId",
                        column: x => x.UserId,
                        principalTable: "idn_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "clt_Contact",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ClientId = table.Column<Guid>(nullable: false),
                    ContactTypeId = table.Column<Guid>(nullable: false),
                    Value = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_Contact", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_Contact_clt_Client_ClientId",
                        column: x => x.ClientId,
                        principalTable: "clt_Client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clt_Contact_clt_ContactType_ContactTypeId",
                        column: x => x.ContactTypeId,
                        principalTable: "clt_ContactType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "clt_Policy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ClientId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    Number = table.Column<string>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: true),
                    Premium = table.Column<decimal>(type: "Money", nullable: true),
                    PolicyTypeId = table.Column<Guid>(nullable: true),
                    PolicyProductTypeId = table.Column<Guid>(nullable: true),
                    PolicyProductId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_Policy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_Policy_clt_Client_ClientId",
                        column: x => x.ClientId,
                        principalTable: "clt_Client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clt_Policy_dir_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "dir_Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clt_Policy_clt_PolicyProduct_PolicyProductId",
                        column: x => x.PolicyProductId,
                        principalTable: "clt_PolicyProduct",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_clt_Policy_clt_PolicyProductType_PolicyProductTypeId",
                        column: x => x.PolicyProductTypeId,
                        principalTable: "clt_PolicyProductType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_clt_Policy_clt_PolicyType_PolicyTypeId",
                        column: x => x.PolicyTypeId,
                        principalTable: "clt_PolicyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_clt_Policy_idn_User_UserId",
                        column: x => x.UserId,
                        principalTable: "idn_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "com_Commission",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CommissionStatementId = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: false),
                    CommissionTypeId = table.Column<Guid>(nullable: false),
                    AmountIncludingVAT = table.Column<decimal>(type: "Money", nullable: false),
                    VAT = table.Column<decimal>(type: "Money", nullable: false),
                    SourceData = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_Commission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_Commission_com_CommissionStatement_CommissionStatementId",
                        column: x => x.CommissionStatementId,
                        principalTable: "com_CommissionStatement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_Commission_com_CommissionType_CommissionTypeId",
                        column: x => x.CommissionTypeId,
                        principalTable: "com_CommissionType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_Commission_clt_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "clt_Policy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "com_CommissionError",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CommissionStatementId = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: true),
                    ClientId = table.Column<Guid>(nullable: true),
                    CommissionTypeId = table.Column<Guid>(nullable: true),
                    Data = table.Column<string>(nullable: false),
                    IsFormatValid = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionError", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_CommissionError_clt_Client_ClientId",
                        column: x => x.ClientId,
                        principalTable: "clt_Client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_com_CommissionError_com_CommissionStatement_CommissionStatementId",
                        column: x => x.CommissionStatementId,
                        principalTable: "com_CommissionStatement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_CommissionError_clt_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "clt_Policy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "clt_ClientType",
                columns: new[] { "Id", "Code", "DisplayOrder", "Name" },
                values: new object[,]
                {
                    { new Guid("27bb22b3-4c3d-41a3-48bf-690a98f8f780"), "individual", 1, "Individual" },
                    { new Guid("295565bf-7485-85f1-6c98-947ab0b7770c"), "company", 2, "Company" },
                    { new Guid("55f6c0ef-ae2c-faac-adff-ea3bd269043f"), "trust", 3, "Trust" }
                });

            migrationBuilder.InsertData(
                table: "clt_ContactType",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("d6349e22-3e27-404a-8584-58e420510834"), "Cellphone Number" },
                    { new Guid("b3c261d0-4e1d-4dd8-b944-6d6afd1795e0"), "Email Address" }
                });

            migrationBuilder.InsertData(
                table: "clt_MarritalStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("77fa3769-7775-4cdd-b5d4-8b526b2d894c"), "Single" },
                    { new Guid("5f7a5d69-845c-4f8d-b108-7c70084f3f6a"), "Married COP" },
                    { new Guid("b31331ec-73cb-4985-aa93-e60e04a48095"), "Married ANC" },
                    { new Guid("b16cbd3b-cf50-4a74-8f38-a8ca6b1cb83f"), "Married ANC (with Accrual)" },
                    { new Guid("e4f03497-5dbf-4bd0-bc14-660a3969f011"), "Widowed" },
                    { new Guid("91ebd765-bd8b-4908-94dc-00f09fe37ca7"), "Divorced" }
                });

            migrationBuilder.InsertData(
                table: "clt_PolicyType",
                columns: new[] { "Id", "Code", "Name" },
                values: new object[,]
                {
                    { new Guid("8fe8751f-c4f0-01c5-26bd-a92f918651d2"), "group_scheme", "Group scheme" },
                    { new Guid("3d991459-2043-46b9-9357-5446a993b81d"), "rewards", "Rewards Program" },
                    { new Guid("023107f5-97a6-456d-9182-7bbda72ca82a"), "medical_cover", "Medical Cover" },
                    { new Guid("a98bb718-4acb-4fad-afe9-5fbba00203b9"), "investment", "Investment" },
                    { new Guid("f3d877b4-1800-4711-8cc9-35169f8bd60b"), "life_insurance", "Life Insurance" },
                    { new Guid("a90a5869-4da5-4cce-8973-9a8194c2bdcb"), "short_term", "Short Term Insurance" }
                });

            migrationBuilder.InsertData(
                table: "com_CommissionEarningsType",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("8b42edc0-fac6-e946-c779-9d90a805c294"), "Monthly Annuity" },
                    { new Guid("e8799015-6f4a-5d45-5be9-0fcd516e0951"), "Annual Annuity" },
                    { new Guid("e7f98561-f018-3edd-2118-e3646c89e2a2"), "Life 1st Years" },
                    { new Guid("9f8fc29d-0f1c-b952-d446-79cc3ed967d7"), "Once Off Commissions" }
                });

            migrationBuilder.InsertData(
                table: "dir_Application",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "Client" },
                    { new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Directory" },
                    { new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Commission" }
                });

            migrationBuilder.InsertData(
                table: "clt_PolicyProductType",
                columns: new[] { "Id", "Code", "Name", "PolicyTypeId" },
                values: new object[,]
                {
                    { new Guid("0c55f316-f446-a8f8-488c-ac1eb587a9c9"), "inv_insurance_benefits", "Life Insurance Benefits", new Guid("a98bb718-4acb-4fad-afe9-5fbba00203b9") },
                    { new Guid("988d7de4-1760-f6e8-b9c2-c68e4d95e7e2"), "rewards_rewards", "Group Life (Unapproved)", new Guid("8fe8751f-c4f0-01c5-26bd-a92f918651d2") },
                    { new Guid("a202bce5-8e20-a795-1a38-c93b0cfd41ac"), "rewards_rewards", "Group Life (Approved)", new Guid("8fe8751f-c4f0-01c5-26bd-a92f918651d2") },
                    { new Guid("da086441-91a9-6e5e-5ad6-3167b2076329"), "rewards_rewards", "Rewards", new Guid("3d991459-2043-46b9-9357-5446a993b81d") },
                    { new Guid("f6db6be4-2672-7063-6920-ae95a0130b73"), "med_gap_cover", "Gap Cover", new Guid("023107f5-97a6-456d-9182-7bbda72ca82a") },
                    { new Guid("95b24f26-5d16-0289-ea4d-754603c3e950"), "med_medical_aid", "Medical Aid", new Guid("023107f5-97a6-456d-9182-7bbda72ca82a") },
                    { new Guid("0269860e-a5ab-7912-e65a-539c124d5593"), "med_add_medical_savings", "Additional Medical Savings", new Guid("023107f5-97a6-456d-9182-7bbda72ca82a") },
                    { new Guid("062d7233-f743-9e5a-8c07-d5580bfa11a4"), "short_personal_cover", "Personal Cover", new Guid("a90a5869-4da5-4cce-8973-9a8194c2bdcb") },
                    { new Guid("178c71d8-f378-fc92-6347-149108b4f24f"), "life_insurance_benefits", "Life Insurance Benefits", new Guid("f3d877b4-1800-4711-8cc9-35169f8bd60b") },
                    { new Guid("62007d95-7d61-4182-b998-9ffb4c5fda0b"), "inv_tax_free", "Tax Free", new Guid("a98bb718-4acb-4fad-afe9-5fbba00203b9") },
                    { new Guid("3b7ccd1e-44b5-d81e-b6b4-18c56c1c077f"), "inv_endowment", "Endowment", new Guid("a98bb718-4acb-4fad-afe9-5fbba00203b9") },
                    { new Guid("67c1d0a3-b5b4-3c23-4256-4e79266f5378"), "short_commercial_cover", "Commercial Cover", new Guid("a90a5869-4da5-4cce-8973-9a8194c2bdcb") }
                });

            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[,]
                {
                    { "clt_import_clients", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "Import Clients" },
                    { "clt_edit_policies", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "Edit Policies" },
                    { "clt_view_contacts", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "View Contacts" },
                    { "clt_edit_contacts", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "Edit Contacts" },
                    { "clt_export_clients", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "Export Clients" },
                    { "com_view_commission_statement_templates", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Statement Templates" },
                    { "com_view_commissions", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commissions" },
                    { "com_edit_commissions", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Edit Commissions" },
                    { "com_view_commission_statements", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Statements" },
                    { "com_edit_commission_statements", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Edit Commission Statements" },
                    { "clt_view_policies", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "View Policies" },
                    { "com_import_commissions", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Import Commissions" },
                    { "clt_edit_clients", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "Edit Clients" },
                    { "dir_view_applications", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Applications" },
                    { "dir_edit_lookups", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Lookups" },
                    { "dir_view_lookups", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Lookups" },
                    { "dir_view_audit_logs", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Audit Logs" },
                    { "dir_view_usecases", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View UseCases" },
                    { "com_edit_commission_statement_templates", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Edit Commission Statement Templates" },
                    { "dir_edit_roles", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Roles" },
                    { "dir_view_roles", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Roles" },
                    { "dir_edit_branches", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Branches" },
                    { "dir_view_branches", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Branches" },
                    { "dir_edit_organisations", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Organisations" },
                    { "dir_view_organisations", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Organisations" },
                    { "dir_edit_users", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Users" },
                    { "dir_view_users", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Users" },
                    { "clt_view_clients", new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"), "View Clients" },
                    { "com_view_report_client_revenue", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Client Revenue Report" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_clt_Client_ClientTypeId",
                table: "clt_Client",
                column: "ClientTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Client_MarritalStatusId",
                table: "clt_Client",
                column: "MarritalStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Client_OrganisationId",
                table: "clt_Client",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Contact_ClientId",
                table: "clt_Contact",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Contact_ContactTypeId",
                table: "clt_Contact",
                column: "ContactTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Policy_ClientId",
                table: "clt_Policy",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Policy_CompanyId",
                table: "clt_Policy",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Policy_PolicyProductId",
                table: "clt_Policy",
                column: "PolicyProductId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Policy_PolicyProductTypeId",
                table: "clt_Policy",
                column: "PolicyProductTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Policy_PolicyTypeId",
                table: "clt_Policy",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_Policy_UserId",
                table: "clt_Policy",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_PolicyProduct_CompanyId",
                table: "clt_PolicyProduct",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_PolicyProduct_PolicyProductTypeId",
                table: "clt_PolicyProduct",
                column: "PolicyProductTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_PolicyProductType_PolicyTypeId",
                table: "clt_PolicyProductType",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_CommissionStatementId",
                table: "com_Commission",
                column: "CommissionStatementId");

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_CommissionTypeId",
                table: "com_Commission",
                column: "CommissionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_PolicyId",
                table: "com_Commission",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionError_ClientId",
                table: "com_CommissionError",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionError_CommissionStatementId",
                table: "com_CommissionError",
                column: "CommissionStatementId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionError_PolicyId",
                table: "com_CommissionError",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionStatement_CompanyId",
                table: "com_CommissionStatement",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionStatement_OrganisationId",
                table: "com_CommissionStatement",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionType_Code",
                table: "com_CommissionType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionType_CommissionEarningsTypeId",
                table: "com_CommissionType",
                column: "CommissionEarningsTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionType_PolicyTypeId",
                table: "com_CommissionType",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_Branch_OrganisationId",
                table: "dir_Branch",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_RoleToUseCase_UseCaseId",
                table: "dir_RoleToUseCase",
                column: "UseCaseId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_UseCase_ApplicationId",
                table: "dir_UseCase",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_idn_Role_ApplicationId",
                table: "idn_Role",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "idn_Role",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_idn_RoleClaim_RoleId",
                table: "idn_RoleClaim",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "idn_User",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "idn_User",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_idn_UserClaim_UserId",
                table: "idn_UserClaim",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_idn_UserLogin_UserId",
                table: "idn_UserLogin",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_idn_UserRole_RoleId",
                table: "idn_UserRole",
                column: "RoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "clt_Contact");

            migrationBuilder.DropTable(
                name: "com_Commission");

            migrationBuilder.DropTable(
                name: "com_CommissionError");

            migrationBuilder.DropTable(
                name: "com_CommissionStatementTemplate");

            migrationBuilder.DropTable(
                name: "dir_AuditLog");

            migrationBuilder.DropTable(
                name: "dir_Branch");

            migrationBuilder.DropTable(
                name: "dir_RoleToUseCase");

            migrationBuilder.DropTable(
                name: "idn_RoleClaim");

            migrationBuilder.DropTable(
                name: "idn_UserClaim");

            migrationBuilder.DropTable(
                name: "idn_UserLogin");

            migrationBuilder.DropTable(
                name: "idn_UserRole");

            migrationBuilder.DropTable(
                name: "idn_UserToken");

            migrationBuilder.DropTable(
                name: "clt_ContactType");

            migrationBuilder.DropTable(
                name: "com_CommissionType");

            migrationBuilder.DropTable(
                name: "com_CommissionStatement");

            migrationBuilder.DropTable(
                name: "clt_Policy");

            migrationBuilder.DropTable(
                name: "dir_UseCase");

            migrationBuilder.DropTable(
                name: "idn_Role");

            migrationBuilder.DropTable(
                name: "com_CommissionEarningsType");

            migrationBuilder.DropTable(
                name: "clt_Client");

            migrationBuilder.DropTable(
                name: "clt_PolicyProduct");

            migrationBuilder.DropTable(
                name: "idn_User");

            migrationBuilder.DropTable(
                name: "dir_Application");

            migrationBuilder.DropTable(
                name: "clt_ClientType");

            migrationBuilder.DropTable(
                name: "clt_MarritalStatus");

            migrationBuilder.DropTable(
                name: "dir_Organisation");

            migrationBuilder.DropTable(
                name: "dir_Company");

            migrationBuilder.DropTable(
                name: "clt_PolicyProductType");

            migrationBuilder.DropTable(
                name: "clt_PolicyType");
        }
    }
}
