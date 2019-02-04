using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class orgIdOnCommissionStatement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OrganisationId",
                table: "com_CommissionStatement",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionStatement_OrganisationId",
                table: "com_CommissionStatement",
                column: "OrganisationId");

            migrationBuilder.AddForeignKey(
                name: "FK_com_CommissionStatement_dir_Organisation_OrganisationId",
                table: "com_CommissionStatement",
                column: "OrganisationId",
                principalTable: "dir_Organisation",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_com_CommissionStatement_dir_Organisation_OrganisationId",
                table: "com_CommissionStatement");

            migrationBuilder.DropIndex(
                name: "IX_com_CommissionStatement_OrganisationId",
                table: "com_CommissionStatement");

            migrationBuilder.DropColumn(
                name: "OrganisationId",
                table: "com_CommissionStatement");
        }
    }
}
