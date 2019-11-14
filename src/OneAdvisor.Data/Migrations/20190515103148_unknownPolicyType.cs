using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class unknownPolicyType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "clt_PolicyType",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("023107f5-97a6-456d-9182-7bbda72ca82a"),
                column: "DisplayOrder",
                value: 4);

            migrationBuilder.UpdateData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("3d991459-2043-46b9-9357-5446a993b81d"),
                column: "DisplayOrder",
                value: 5);

            migrationBuilder.UpdateData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("8fe8751f-c4f0-01c5-26bd-a92f918651d2"),
                column: "DisplayOrder",
                value: 6);

            migrationBuilder.UpdateData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("a90a5869-4da5-4cce-8973-9a8194c2bdcb"),
                column: "DisplayOrder",
                value: 3);

            migrationBuilder.UpdateData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("a98bb718-4acb-4fad-afe9-5fbba00203b9"),
                column: "DisplayOrder",
                value: 1);

            migrationBuilder.UpdateData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("f3d877b4-1800-4711-8cc9-35169f8bd60b"),
                column: "DisplayOrder",
                value: 2);

            migrationBuilder.InsertData(
                table: "clt_PolicyType",
                columns: new[] { "Id", "Code", "DisplayOrder", "Name" },
                values: new object[] { new Guid("c498f023-a7c9-f6c3-e021-c265972a209c"), "unknown", 7, "Unknown" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "clt_PolicyType",
                keyColumn: "Id",
                keyValue: new Guid("c498f023-a7c9-f6c3-e021-c265972a209c"));

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "clt_PolicyType");
        }
    }
}
