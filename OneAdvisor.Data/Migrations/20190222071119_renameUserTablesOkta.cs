using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class renameUserTablesOkta : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("delete from com_Commission");
            migrationBuilder.Sql("delete from com_CommissionError");
            migrationBuilder.Sql("delete from com_CommissionStatement");
            migrationBuilder.Sql("delete from mem_Policy");
            migrationBuilder.Sql("delete from dir_User");


            migrationBuilder.DropForeignKey(
                name: "FK_mem_Policy_dir_User_UserId",
                table: "mem_Policy");

            migrationBuilder.DropTable(
                name: "dir_User");

            migrationBuilder.CreateTable(
                name: "dir_OktaUser",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    BranchId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: false),
                    Aliases = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_OktaUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_OktaUser_dir_Branch_BranchId",
                        column: x => x.BranchId,
                        principalTable: "dir_Branch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_dir_OktaUser_BranchId",
                table: "dir_OktaUser",
                column: "BranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Policy_dir_OktaUser_UserId",
                table: "mem_Policy",
                column: "UserId",
                principalTable: "dir_OktaUser",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Policy_dir_OktaUser_UserId",
                table: "mem_Policy");

            migrationBuilder.DropTable(
                name: "dir_OktaUser");

            migrationBuilder.CreateTable(
                name: "dir_User",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Aliases = table.Column<string>(nullable: false),
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
                name: "IX_dir_User_BranchId",
                table: "dir_User",
                column: "BranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Policy_dir_User_UserId",
                table: "mem_Policy",
                column: "UserId",
                principalTable: "dir_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
