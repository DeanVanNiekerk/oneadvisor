using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("delete from lkp_CommissionType");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "lkp_CommissionType",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "PolicyTypeId",
                table: "lkp_CommissionType",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "com_Commission",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: false),
                    CommissionTypeId = table.Column<Guid>(nullable: false),
                    AmountIncludingVAT = table.Column<decimal>(type: "Money", nullable: false),
                    VAT = table.Column<decimal>(type: "Money", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_Commission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_Commission_lkp_CommissionType_CommissionTypeId",
                        column: x => x.CommissionTypeId,
                        principalTable: "lkp_CommissionType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_Commission_mem_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "mem_Policy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_lkp_CommissionType_PolicyTypeId",
                table: "lkp_CommissionType",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_CommissionTypeId",
                table: "com_Commission",
                column: "CommissionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_PolicyId",
                table: "com_Commission",
                column: "PolicyId");

            migrationBuilder.AddForeignKey(
                name: "FK_lkp_CommissionType_lkp_PolicyType_PolicyTypeId",
                table: "lkp_CommissionType",
                column: "PolicyTypeId",
                principalTable: "lkp_PolicyType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_lkp_CommissionType_lkp_PolicyType_PolicyTypeId",
                table: "lkp_CommissionType");

            migrationBuilder.DropTable(
                name: "com_Commission");

            migrationBuilder.DropIndex(
                name: "IX_lkp_CommissionType_PolicyTypeId",
                table: "lkp_CommissionType");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "lkp_CommissionType");

            migrationBuilder.DropColumn(
                name: "PolicyTypeId",
                table: "lkp_CommissionType");
        }
    }
}
