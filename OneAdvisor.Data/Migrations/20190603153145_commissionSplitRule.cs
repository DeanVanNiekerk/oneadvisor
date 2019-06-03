using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commissionSplitRule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "com_CommissionSplitRule",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    IsDefault = table.Column<bool>(nullable: false),
                    Split = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionSplitRule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_CommissionSplitRule_idn_User_UserId",
                        column: x => x.UserId,
                        principalTable: "idn_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "com_edit_commission_split_rules", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "Edit Commission Split Rules" });

            migrationBuilder.InsertData(
                table: "dir_UseCase",
                columns: new[] { "Id", "ApplicationId", "Name" },
                values: new object[] { "com_view_commission_split_rules", new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"), "View Commission Split Rules" });

            migrationBuilder.CreateIndex(
                name: "IX_idn_User_BranchId",
                table: "idn_User",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionSplitRule_UserId",
                table: "com_CommissionSplitRule",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_idn_User_dir_Branch_BranchId",
                table: "idn_User",
                column: "BranchId",
                principalTable: "dir_Branch",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_idn_User_dir_Branch_BranchId",
                table: "idn_User");

            migrationBuilder.DropTable(
                name: "com_CommissionSplitRule");

            migrationBuilder.DropIndex(
                name: "IX_idn_User_BranchId",
                table: "idn_User");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_edit_commission_split_rules");

            migrationBuilder.DeleteData(
                table: "dir_UseCase",
                keyColumn: "Id",
                keyValue: "com_view_commission_split_rules");
        }
    }
}
