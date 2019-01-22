using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class renameMarritalStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Member_lkp_MarrialStatus_MarrialStatusId",
                table: "mem_Member");

            migrationBuilder.DropTable(
                name: "lkp_MarrialStatus");

            migrationBuilder.DropIndex(
                name: "IX_mem_Member_MarrialStatusId",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "MarrialStatusId",
                table: "mem_Member");

            migrationBuilder.CreateTable(
                name: "lkp_MarritalStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_MarritalStatus", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_mem_Member_MarritalStatusId",
                table: "mem_Member",
                column: "MarritalStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Member_lkp_MarritalStatus_MarritalStatusId",
                table: "mem_Member",
                column: "MarritalStatusId",
                principalTable: "lkp_MarritalStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Member_lkp_MarritalStatus_MarritalStatusId",
                table: "mem_Member");

            migrationBuilder.DropTable(
                name: "lkp_MarritalStatus");

            migrationBuilder.DropIndex(
                name: "IX_mem_Member_MarritalStatusId",
                table: "mem_Member");

            migrationBuilder.AddColumn<Guid>(
                name: "MarrialStatusId",
                table: "mem_Member",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "lkp_MarrialStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_MarrialStatus", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_mem_Member_MarrialStatusId",
                table: "mem_Member",
                column: "MarrialStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Member_lkp_MarrialStatus_MarrialStatusId",
                table: "mem_Member",
                column: "MarrialStatusId",
                principalTable: "lkp_MarrialStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
