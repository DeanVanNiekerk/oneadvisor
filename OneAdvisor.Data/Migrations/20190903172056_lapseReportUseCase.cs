using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class lapseReportUseCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "com_view_report_commission_lapse", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Lapse Report" });

            migrationBuilder.Sql(@"
INSERT INTO dir_RoleToUseCase
    SELECT Id, 'com_view_report_commission_lapse'
    FROM idn_Role
    WHERE Name = 'com_administrator'
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "com_view_report_commission_lapse");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_view_report_commission_lapse");
        }
    }
}
