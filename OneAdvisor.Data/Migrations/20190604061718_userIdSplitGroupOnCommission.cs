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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SplitGroupId",
                table: "com_Commission");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "com_Commission");
        }
    }
}
