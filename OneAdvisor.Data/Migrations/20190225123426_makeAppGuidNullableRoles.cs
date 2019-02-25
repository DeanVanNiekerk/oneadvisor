using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class makeAppGuidNullableRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetRoles_dir_Application_ApplicationId",
                table: "AspNetRoles");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApplicationId",
                table: "AspNetRoles",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetRoles_dir_Application_ApplicationId",
                table: "AspNetRoles",
                column: "ApplicationId",
                principalTable: "dir_Application",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetRoles_dir_Application_ApplicationId",
                table: "AspNetRoles");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApplicationId",
                table: "AspNetRoles",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetRoles_dir_Application_ApplicationId",
                table: "AspNetRoles",
                column: "ApplicationId",
                principalTable: "dir_Application",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
