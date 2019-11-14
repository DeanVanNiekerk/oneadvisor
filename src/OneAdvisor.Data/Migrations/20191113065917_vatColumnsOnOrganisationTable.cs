using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class vatColumnsOnOrganisationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "VATRegistered",
                table: "dir_Organisation",
                nullable: false,
                defaultValueSql: "0");

            migrationBuilder.AddColumn<DateTime>(
                name: "VATRegistrationDate",
                table: "dir_Organisation",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VATRegistered",
                table: "dir_Organisation");

            migrationBuilder.DropColumn(
                name: "VATRegistrationDate",
                table: "dir_Organisation");
        }
    }
}
