using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class extraFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_mem_Policy_CompanyId_Number",
                table: "mem_Policy");

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "mem_Policy",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<decimal>(
                name: "Premium",
                table: "mem_Policy",
                type: "Money",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "mem_Policy",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "MarriageDate",
                table: "mem_Member",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MarrialStatusId",
                table: "mem_Member",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MarritalStatusId",
                table: "mem_Member",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxNumber",
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
                name: "IX_mem_Policy_CompanyId",
                table: "mem_Policy",
                column: "CompanyId");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Member_lkp_MarrialStatus_MarrialStatusId",
                table: "mem_Member");

            migrationBuilder.DropTable(
                name: "lkp_MarrialStatus");

            migrationBuilder.DropIndex(
                name: "IX_mem_Policy_CompanyId",
                table: "mem_Policy");

            migrationBuilder.DropIndex(
                name: "IX_mem_Member_MarrialStatusId",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "Premium",
                table: "mem_Policy");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "mem_Policy");

            migrationBuilder.DropColumn(
                name: "MarriageDate",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "MarrialStatusId",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "MarritalStatusId",
                table: "mem_Member");

            migrationBuilder.DropColumn(
                name: "TaxNumber",
                table: "mem_Member");

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "mem_Policy",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_mem_Policy_CompanyId_Number",
                table: "mem_Policy",
                columns: new[] { "CompanyId", "Number" },
                unique: true);
        }
    }
}
