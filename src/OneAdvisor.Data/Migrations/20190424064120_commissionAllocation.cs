using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commissionAllocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "com_CommissionAllocation",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FromClientId = table.Column<Guid>(nullable: false),
                    ToClientId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_com_CommissionAllocation", x => x.Id);
                    table.ForeignKey(
                        name: "ForeignKey_FromClient_FromCommissionAllocations",
                        column: x => x.FromClientId,
                        principalTable: "clt_Client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "ForeignKey_ToClient_ToCommissionAllocations",
                        column: x => x.ToClientId,
                        principalTable: "clt_Client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionAllocation_FromClientId",
                table: "com_CommissionAllocation",
                column: "FromClientId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionAllocation_ToClientId",
                table: "com_CommissionAllocation",
                column: "ToClientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "com_CommissionAllocation");
        }
    }
}
