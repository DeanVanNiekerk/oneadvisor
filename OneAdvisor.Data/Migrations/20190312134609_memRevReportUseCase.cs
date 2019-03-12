using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class memRevReportUseCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("dir_UseCase", new string[] { "Id", "Name", "ApplicationId" }, new string[] { "com_view_report_member_revenue", "View Commission Member Revenue Report", "2fca4500-9142-4940-aaf4-b18925c96d66" });

            migrationBuilder.Sql(@"
                INSERT INTO dir_RoleToUseCase
                SELECT Id AS 'RoleId', 'com_view_report_member_revenue' AS 'UseCaseId'
                FROM AspNetRoles
                WHERE Name = 'com_administrator'
                OR NAME = 'com_readonly'
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
