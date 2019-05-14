using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class unknownEarningsType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "com_CommissionEarningsType",
                columns: new[] { "Id", "DisplayOrder", "Name" },
                values: new object[] { new Guid("27ec936b-5db7-64b8-1a1b-5edb3b56a20d"), 4, "Unknown" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("27ec936b-5db7-64b8-1a1b-5edb3b56a20d"));
        }
    }
}
