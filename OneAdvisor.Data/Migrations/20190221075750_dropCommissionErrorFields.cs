using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class dropCommissionErrorFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommissionTypeCode",
                table: "com_CommissionError");

            migrationBuilder.DropColumn(
                name: "PolicyNumber",
                table: "com_CommissionError");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommissionTypeCode",
                table: "com_CommissionError",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PolicyNumber",
                table: "com_CommissionError",
                nullable: true);
        }
    }
}
