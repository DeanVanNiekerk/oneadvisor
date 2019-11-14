using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class comAllocationsUseCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "com_view_commission_allocations", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Allocations" });

            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "com_edit_commission_allocations", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Edit Commission Allocations" });

            migrationBuilder.Sql(@"
            INSERT INTO dir_RoleToUseCase
                SELECT Id, 'com_view_commission_allocations'
                FROM idn_Role
                WHERE Name = 'com_administrator'
                OR Name = 'com_readonly'

            INSERT INTO dir_RoleToUseCase
                SELECT Id, 'com_edit_commission_allocations'
                FROM idn_Role
                WHERE Name = 'com_administrator'
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_edit_commission_allocations");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_view_commission_allocations");
        }
    }
}
