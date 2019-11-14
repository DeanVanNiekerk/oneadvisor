using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class auditLogsUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM dir_AuditLog");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "dir_AuditLog",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AlterColumn<string>(
                name: "Action",
                table: "dir_AuditLog",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_dir_AuditLog_UserId",
                table: "dir_AuditLog",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_dir_AuditLog_idn_User_UserId",
                table: "dir_AuditLog",
                column: "UserId",
                principalTable: "idn_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_dir_AuditLog_idn_User_UserId",
                table: "dir_AuditLog");

            migrationBuilder.DropIndex(
                name: "IX_dir_AuditLog_UserId",
                table: "dir_AuditLog");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "dir_AuditLog",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Action",
                table: "dir_AuditLog",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
