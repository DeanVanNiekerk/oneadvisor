using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newCommissionTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "com_Commission");

            migrationBuilder.AddColumn<Guid>(
                name: "CommissionStatementId",
                table: "com_Commission",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "com_CommissionError",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CommissionStatementId = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: true),
                    MemberId = table.Column<Guid>(nullable: true),
                    Data = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionError", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "com_CommissionStatement",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AmountIncludingVAT = table.Column<decimal>(nullable: false),
                    VAT = table.Column<decimal>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionStatement", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "com_CommissionError");

            migrationBuilder.DropTable(
                name: "com_CommissionStatement");

            migrationBuilder.DropColumn(
                name: "CommissionStatementId",
                table: "com_Commission");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "com_Commission",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
