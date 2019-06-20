using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class comAllocationPolicy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PolicyIds",
                table: "com_CommissionAllocation");

            migrationBuilder.CreateTable(
                name: "com_CommissionAllocationPolicy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CommissionAllocationId = table.Column<Guid>(nullable: false),
                    PolicyId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionAllocationPolicy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_com_CommissionAllocationPolicy_com_CommissionAllocation_CommissionAllocationId",
                        column: x => x.CommissionAllocationId,
                        principalTable: "com_CommissionAllocation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_com_CommissionAllocationPolicy_clt_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "clt_Policy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionAllocationPolicy_CommissionAllocationId",
                table: "com_CommissionAllocationPolicy",
                column: "CommissionAllocationId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionAllocationPolicy_PolicyId",
                table: "com_CommissionAllocationPolicy",
                column: "PolicyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "com_CommissionAllocationPolicy");

            migrationBuilder.AddColumn<string>(
                name: "PolicyIds",
                table: "com_CommissionAllocation",
                nullable: false,
                defaultValue: "");
        }
    }
}
