using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class editRoleUseCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("dir_UseCase", new string[] { "Id", "Name", "ApplicationId" }, new string[] { "dir_edit_roles", "Edit Roles", "66c3b4e8-8a30-4a4b-be4d-3928d12fefe9" });

            migrationBuilder.Sql(@"
                INSERT INTO dir_RoleToUseCase
                SELECT Id AS 'RoleId', 'dir_edit_roles' AS 'UseCaseId'
                FROM AspNetRoles
                WHERE Name = 'dir_administrator'
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
