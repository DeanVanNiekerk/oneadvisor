using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newTable_vatRate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dir_VATRate",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Rate = table.Column<decimal>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: true),
                    EndDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_VATRate", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "dir_VATRate",
                columns: new[] { "Id", "EndDate", "Rate", "StartDate" },
                values: new object[] { new Guid("327abe6a-c200-2e53-ba63-e665174438b9"), new DateTime(2018, 3, 31, 23, 59, 59, 0, DateTimeKind.Unspecified), 14m, null });

            migrationBuilder.InsertData(
                table: "dir_VATRate",
                columns: new[] { "Id", "EndDate", "Rate", "StartDate" },
                values: new object[] { new Guid("490e393a-71bb-b54c-99cf-87ca4e8a88dc"), null, 15m, new DateTime(2018, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dir_VATRate");
        }
    }
}
