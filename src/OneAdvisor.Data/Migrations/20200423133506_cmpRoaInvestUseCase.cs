using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class cmpRoaInvestUseCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "cmp_view_roa_invest", new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"), "View ROA Invest Document" });

            migrationBuilder.InsertData(
                table: "idn_Role",
                columns: new[] { "Id", "Name", "NormalizedName", "Description", "ApplicationId", "ConcurrencyStamp" },
                values: new object[] { new Guid("e55f4a30-7b53-9252-fd2a-69e18321b5eb"), "cmp_administrator", "CMP_ADMINISTRATOR", "Administrator", new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"), Guid.NewGuid().ToString() });

            migrationBuilder.Sql(@"
                INSERT INTO dir_RoleToUseCase
                    SELECT Id, 'cmp_view_roa_invest'
                    FROM idn_Role
                    WHERE Name = 'cmp_administrator'
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "dir_RoleToUseCase",
                keyColumn: "UseCaseId",
                keyValue: "cmp_view_roa_invest");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "cmp_view_roa_invest");
        }
    }
}
