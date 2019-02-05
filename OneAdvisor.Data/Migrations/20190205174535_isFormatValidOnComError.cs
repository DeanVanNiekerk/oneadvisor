using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class isFormatValidOnComError : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "VAT",
                table: "com_CommissionStatement",
                type: "Money",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "AmountIncludingVAT",
                table: "com_CommissionStatement",
                type: "Money",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AddColumn<bool>(
                name: "IsFormatValue",
                table: "com_CommissionError",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFormatValue",
                table: "com_CommissionError");

            migrationBuilder.AlterColumn<decimal>(
                name: "VAT",
                table: "com_CommissionStatement",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "Money");

            migrationBuilder.AlterColumn<decimal>(
                name: "AmountIncludingVAT",
                table: "com_CommissionStatement",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "Money");
        }
    }
}
