using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class businessEntityClientType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "clt_ClientType",
                columns: new[] { "Id", "Code", "DisplayOrder", "Name" },
                values: new object[] { new Guid("bc0b4043-25cc-dbb6-cfd5-981557a10ca1"), "business", 4, "Business Entity" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "clt_ClientType",
                keyColumn: "Id",
                keyValue: new Guid("bc0b4043-25cc-dbb6-cfd5-981557a10ca1"));
        }
    }
}
