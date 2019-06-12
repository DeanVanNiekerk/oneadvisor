using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class policyCommissionSplitRule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "clt_PolicyCommissionSplitRule",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: false),
                    CommissionSplitRuleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_PolicyCommissionSplitRule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_PolicyCommissionSplitRule_com_CommissionSplitRule_CommissionSplitRuleId",
                        column: x => x.CommissionSplitRuleId,
                        principalTable: "com_CommissionSplitRule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clt_PolicyCommissionSplitRule_clt_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "clt_Policy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_clt_PolicyCommissionSplitRule_CommissionSplitRuleId",
                table: "clt_PolicyCommissionSplitRule",
                column: "CommissionSplitRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_clt_PolicyCommissionSplitRule_PolicyId",
                table: "clt_PolicyCommissionSplitRule",
                column: "PolicyId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "clt_PolicyCommissionSplitRule");
        }
    }
}
