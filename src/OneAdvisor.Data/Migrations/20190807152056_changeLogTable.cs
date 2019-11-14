using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class changeLogTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dir_ChangeLog",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    VersionNumber = table.Column<string>(nullable: false),
                    ReleaseDate = table.Column<DateTime>(nullable: false),
                    Log = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_ChangeLog", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "dir_edit_change_logs", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Change Logs" });

            migrationBuilder.Sql(@"
            INSERT INTO dir_RoleToUseCase
                SELECT Id, 'dir_edit_change_logs'
                FROM idn_Role
                WHERE Name = 'dir_administrator'
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dir_ChangeLog");

            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "dir_edit_change_logs");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "dir_edit_change_logs");
        }
    }
}
