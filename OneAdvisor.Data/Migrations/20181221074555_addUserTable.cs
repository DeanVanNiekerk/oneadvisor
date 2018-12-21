using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class addUserTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "dir_User",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    BranchId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_User_dir_Branch_BranchId",
                        column: x => x.BranchId,
                        principalTable: "dir_Branch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_mem_Member_UserId",
                table: "mem_Member",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_dir_User_BranchId",
                table: "dir_User",
                column: "BranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Member_dir_User_UserId",
                table: "mem_Member",
                column: "UserId",
                principalTable: "dir_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Member_dir_User_UserId",
                table: "mem_Member");

            migrationBuilder.DropTable(
                name: "dir_User");

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
    }
}
