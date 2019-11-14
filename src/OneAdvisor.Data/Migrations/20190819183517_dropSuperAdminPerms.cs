using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class dropSuperAdminPerms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
               table: "dir_RoleToUseCase",
               keyColumn: "UseCaseId",
               keyValue: "com_edit_commission_statement_templates");

            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "com_view_commission_statement_templates");

            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "dir_edit_change_logs");

            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "dir_view_applications");

            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "dir_view_usecases");




            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_edit_commission_statement_templates");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_view_commission_statement_templates");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "dir_edit_change_logs");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "dir_view_applications");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "dir_view_usecases");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[,]
                {
                    { "dir_view_applications", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View Applications" },
                    { "dir_view_usecases", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "View UseCases" },
                    { "dir_edit_change_logs", new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"), "Edit Change Logs" },
                    { "com_view_commission_statement_templates", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Statement Templates" },
                    { "com_edit_commission_statement_templates", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Edit Commission Statement Templates" }
                });
        }
    }
}
