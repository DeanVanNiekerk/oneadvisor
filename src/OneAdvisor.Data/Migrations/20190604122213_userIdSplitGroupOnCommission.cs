using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class userIdSplitGroupOnCommission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SplitGroupId",
                table: "com_Commission",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "com_Commission",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_UserId",
                table: "com_Commission",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission",
                column: "UserId",
                principalTable: "idn_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission");

            migrationBuilder.DropIndex(
                name: "IX_com_Commission_UserId",
                table: "com_Commission");

            migrationBuilder.DropColumn(
                name: "SplitGroupId",
                table: "com_Commission");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "com_Commission");
        }
    }
}
