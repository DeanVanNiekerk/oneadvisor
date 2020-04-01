using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class colourHexOnApplication : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColourHex",
                table: "dir_Application",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"),
                column: "ColourHex",
                value: "#2A2A72");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"),
                column: "ColourHex",
                value: "#009FFD");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"),
                column: "ColourHex",
                value: "#CC3F0C");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ca35b7ac-351a-0ff1-5d45-9bee6de9e051"),
                column: "ColourHex",
                value: "#AE1827");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"),
                column: "ColourHex",
                value: "#005A38");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColourHex",
                table: "dir_Application");
        }
    }
}
