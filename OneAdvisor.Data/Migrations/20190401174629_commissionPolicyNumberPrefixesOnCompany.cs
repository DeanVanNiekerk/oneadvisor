using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commissionPolicyNumberPrefixesOnCompany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommissionPolicyNumberPrefixes",
                table: "dir_Company",
                nullable: false,
                defaultValue: "[]");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommissionPolicyNumberPrefixes",
                table: "dir_Company");
        }
    }
}
