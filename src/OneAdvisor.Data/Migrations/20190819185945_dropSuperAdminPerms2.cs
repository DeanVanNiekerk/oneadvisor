using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class dropSuperAdminPerms2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "dir_edit_lookups");

            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "dir_view_lookups");


            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "dir_edit_lookups");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "dir_view_lookups");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "dir_view_lookups", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Lookups" });

            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "dir_edit_lookups", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Lookups" });
        }
    }
}
