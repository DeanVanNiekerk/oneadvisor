using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class OrgIdOnUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [mem_MemberPolicy]", true);
            migrationBuilder.Sql("DELETE FROM [mem_Member]", true);

            migrationBuilder.DropForeignKey(
                name: "FK_mem_Member_dir_User_UserId",
                table: "mem_Member");

            migrationBuilder.DropIndex(
                name: "IX_mem_Member_UserId",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "mem_Member");

            migrationBuilder.AddColumn<Guid>(
                name: "OrganisationId",
                table: "mem_Member",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_mem_Member_OrganisationId",
                table: "mem_Member",
                column: "OrganisationId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Member_dir_Organisation_OrganisationId",
                table: "mem_Member",
                column: "OrganisationId",
                principalTable: "dir_Organisation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Member_dir_Organisation_OrganisationId",
                table: "mem_Member");

            migrationBuilder.DropIndex(
                name: "IX_mem_Member_OrganisationId",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "OrganisationId",
                table: "mem_Member");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "mem_Member",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Member_UserId",
                table: "mem_Member",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Member_dir_User_UserId",
                table: "mem_Member",
                column: "UserId",
                principalTable: "dir_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
