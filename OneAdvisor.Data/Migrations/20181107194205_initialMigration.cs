using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class initialMigration : Migration
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dir_RoleToUseCase");

            migrationBuilder.DropTable(
                name: "dir_Role");

            migrationBuilder.DropTable(
                name: "dir_UseCase");

            migrationBuilder.DropTable(
                name: "dir_Application");
        }
    }
}
