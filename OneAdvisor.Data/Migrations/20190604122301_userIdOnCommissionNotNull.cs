using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class userIdOnCommissionNotNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE c
                SET c.UserId = p.UserId
                FROM com_Commission c
                JOIN clt_Policy p ON c.PolicyId = p.Id
                WHERE c.UserId IS NULL
            ");

            migrationBuilder.DropForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "com_Commission",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission",
                column: "UserId",
                principalTable: "idn_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "com_Commission",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission",
                column: "UserId",
                principalTable: "idn_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
