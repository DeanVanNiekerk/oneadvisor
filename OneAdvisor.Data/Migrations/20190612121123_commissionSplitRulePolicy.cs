using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commissionSplitRulePolicy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "com_CommissionSplitRulePolicy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CommissionSplitRuleId = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionSplitRulePolicy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_CommissionSplitRulePolicy_com_CommissionSplitRule_CommissionSplitRuleId",
                        column: x => x.CommissionSplitRuleId,
                        principalTable: "com_CommissionSplitRule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_CommissionSplitRulePolicy_clt_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "clt_Policy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionSplitRulePolicy_CommissionSplitRuleId",
                table: "com_CommissionSplitRulePolicy",
                column: "CommissionSplitRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionSplitRulePolicy_PolicyId",
                table: "com_CommissionSplitRulePolicy",
                column: "PolicyId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "com_CommissionSplitRulePolicy");
        }
    }
}
