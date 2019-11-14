using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class earningsTypeOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "com_CommissionEarningsType",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("9f8fc29d-0f1c-b952-d446-79cc3ed967d7"),
                column: "DisplayOrder",
                value: 3);

            migrationBuilder.UpdateData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("e7f98561-f018-3edd-2118-e3646c89e2a2"),
                column: "DisplayOrder",
                value: 2);

            migrationBuilder.UpdateData(
                table: "com_CommissionEarningsType",
                keyColumn: "Id",
                keyValue: new Guid("e8799015-6f4a-5d45-5be9-0fcd516e0951"),
                column: "DisplayOrder",
                value: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "com_CommissionEarningsType");
        }
    }
}
