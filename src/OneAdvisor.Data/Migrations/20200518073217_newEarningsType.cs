using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newEarningsType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("27ec936b-5db7-64b8-1a1b-5edb3b56a20d"),
                column: "DisplayOrder",
                value: 5);

            migrationBuilder.InsertData(
                table: "com_CommissionEarningsType",
                columns: new[] { "Id", "DisplayOrder", "Name" },
                values: new object[] { new Guid("1255d2c7-e637-6331-0114-2abb8a24722e"), 4, "Quarterly Annuity" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("1255d2c7-e637-6331-0114-2abb8a24722e"));

            migrationBuilder.UpdateData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("27ec936b-5db7-64b8-1a1b-5edb3b56a20d"),
                column: "DisplayOrder",
                value: 4);
        }
    }
}
