using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class memRevReportUseCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
            IF NOT EXISTS (SELECT * FROM dir_Application WHERE Id = '66c3b4e8-8a30-4a4b-be4d-3928d12fefe9')
            BEGIN
                INSERT INTO [dbo].[dir_Application] VALUES ('66c3b4e8-8a30-4a4b-be4d-3928d12fefe9', 'Directory')
            END

            IF NOT EXISTS (SELECT * FROM dir_Application WHERE Id = '605ea52c-3627-48e2-8f7c-4819c5ea555b')
            BEGIN
                INSERT INTO [dbo].[dir_Application] VALUES ('605ea52c-3627-48e2-8f7c-4819c5ea555b', 'Member')
            END

            IF NOT EXISTS (SELECT * FROM dir_Application WHERE Id = '2fca4500-9142-4940-aaf4-b18925c96d66')
            BEGIN
                INSERT INTO [dbo].[dir_Application] VALUES ('2fca4500-9142-4940-aaf4-b18925c96d66', 'Commission')
            END
            ");

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
