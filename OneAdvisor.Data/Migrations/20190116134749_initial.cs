using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "lkp_Company",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_Company", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_Role",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 32, nullable: false),
                    Name = table.Column<string>(nullable: false),
                    ApplicationId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_Role", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_Role_dir_Application_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "dir_Application",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dir_UseCase",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 32, nullable: false),
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
                name: "mem_Member",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    OrganisationId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    MaidenName = table.Column<string>(nullable: true),
                    Initials = table.Column<string>(nullable: true),
                    PreferredName = table.Column<string>(nullable: true),
                    IdNumber = table.Column<string>(nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: true),
                    PassportNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mem_Member", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mem_Member_dir_Organisation_OrganisationId",
                        column: x => x.OrganisationId,
                        principalTable: "dir_Organisation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dir_RoleToUseCase",
                columns: table => new
                {
                    RoleId = table.Column<string>(maxLength: 32, nullable: false),
                    UseCaseId = table.Column<string>(maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_RoleToUseCase", x => new { x.RoleId, x.UseCaseId });
                    table.ForeignKey(
                        name: "FK_dir_RoleToUseCase_dir_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "dir_Role",
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
                name: "dir_User",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    BranchId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: false),
                    Aliases = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_User_dir_Branch_BranchId",
                        column: x => x.BranchId,
                        principalTable: "dir_Branch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "mem_Policy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    MemberId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: false),
                    Number = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mem_Policy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mem_Policy_lkp_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "lkp_Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_mem_Policy_mem_Member_MemberId",
                        column: x => x.MemberId,
                        principalTable: "mem_Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_mem_Policy_dir_User_UserId",
                        column: x => x.UserId,
                        principalTable: "dir_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_dir_Branch_OrganisationId",
                table: "dir_Branch",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_Role_ApplicationId",
                table: "dir_Role",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_RoleToUseCase_UseCaseId",
                table: "dir_RoleToUseCase",
                column: "UseCaseId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_UseCase_ApplicationId",
                table: "dir_UseCase",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_User_BranchId",
                table: "dir_User",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Member_OrganisationId",
                table: "mem_Member",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Policy_MemberId",
                table: "mem_Policy",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Policy_UserId",
                table: "mem_Policy",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Policy_CompanyId_Number",
                table: "mem_Policy",
                columns: new[] { "CompanyId", "Number" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dir_RoleToUseCase");

            migrationBuilder.DropTable(
                name: "mem_Policy");

            migrationBuilder.DropTable(
                name: "dir_Role");

            migrationBuilder.DropTable(
                name: "dir_UseCase");

            migrationBuilder.DropTable(
                name: "lkp_Company");

            migrationBuilder.DropTable(
                name: "mem_Member");

            migrationBuilder.DropTable(
                name: "dir_User");

            migrationBuilder.DropTable(
                name: "dir_Application");

            migrationBuilder.DropTable(
                name: "dir_Branch");

            migrationBuilder.DropTable(
                name: "dir_Organisation");
        }
    }
}
