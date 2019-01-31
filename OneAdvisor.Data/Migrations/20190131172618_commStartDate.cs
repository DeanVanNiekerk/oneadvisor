using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commStartDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("delete from com_Commission");

            migrationBuilder.AlterColumn<decimal>(
                name: "VAT",
                table: "com_Commission",
                type: "Money",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "AmountIncludingVAT",
                table: "com_Commission",
                type: "Money",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "com_Commission",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "com_Commission");

            migrationBuilder.AlterColumn<decimal>(
                name: "VAT",
                table: "com_Commission",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "Money");

            migrationBuilder.AlterColumn<decimal>(
                name: "AmountIncludingVAT",
                table: "com_Commission",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "Money");
        }
    }
}
