using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newColumnCommissionEarningsTypeIdOnCommissionType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CommissionEarningsTypeId",
                table: "lkp_CommissionType",
                nullable: false,
                defaultValue: new Guid("8b42edc0-fac6-e946-c779-9d90a805c294"));

            migrationBuilder.CreateIndex(
                name: "IX_lkp_CommissionType_CommissionEarningsTypeId",
                table: "lkp_CommissionType",
                column: "CommissionEarningsTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_lkp_CommissionType_lkp_CommissionEarningsType_CommissionEarningsTypeId",
                table: "lkp_CommissionType",
                column: "CommissionEarningsTypeId",
                principalTable: "lkp_CommissionEarningsType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_lkp_CommissionType_lkp_CommissionEarningsType_CommissionEarningsTypeId",
                table: "lkp_CommissionType");

            migrationBuilder.DropIndex(
                name: "IX_lkp_CommissionType_CommissionEarningsTypeId",
                table: "lkp_CommissionType");

            migrationBuilder.DropColumn(
                name: "CommissionEarningsTypeId",
                table: "lkp_CommissionType");
        }
    }
}
