using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class monthAndYearOnCommissionStatment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DateMonth",
                table: "com_CommissionStatement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DateYear",
                table: "com_CommissionStatement",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql("UPDATE com_CommissionStatement SET DateMonth = MONTH(Date), DateYear = YEAR(Date)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateMonth",
                table: "com_CommissionStatement");

            migrationBuilder.DropColumn(
                name: "DateYear",
                table: "com_CommissionStatement");
        }
    }
}
