using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newApplicationsComplianceAndInvest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "dir_Application",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"), "Compliance" });

            migrationBuilder.InsertData(
                table: "dir_Application",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("ca35b7ac-351a-0ff1-5d45-9bee6de9e051"), "Invest" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ca35b7ac-351a-0ff1-5d45-9bee6de9e051"));

            migrationBuilder.DeleteData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"));
        }
    }
}
