using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newCommissionColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("delete from com_Commission");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "com_CommissionStatement",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "Processed",
                table: "com_CommissionStatement",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionStatement_CompanyId",
                table: "com_CommissionStatement",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionError_CommissionStatementId",
                table: "com_CommissionError",
                column: "CommissionStatementId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionError_MemberId",
                table: "com_CommissionError",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_com_CommissionError_PolicyId",
                table: "com_CommissionError",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_CommissionStatementId",
                table: "com_Commission",
                column: "CommissionStatementId");

            migrationBuilder.AddForeignKey(
                name: "FK_com_Commission_com_CommissionStatement_CommissionStatementId",
                table: "com_Commission",
                column: "CommissionStatementId",
                principalTable: "com_CommissionStatement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_com_CommissionError_com_CommissionStatement_CommissionStatementId",
                table: "com_CommissionError",
                column: "CommissionStatementId",
                principalTable: "com_CommissionStatement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_com_CommissionError_mem_Member_MemberId",
                table: "com_CommissionError",
                column: "MemberId",
                principalTable: "mem_Member",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_com_CommissionError_mem_Policy_PolicyId",
                table: "com_CommissionError",
                column: "PolicyId",
                principalTable: "mem_Policy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_com_CommissionStatement_lkp_Company_CompanyId",
                table: "com_CommissionStatement",
                column: "CompanyId",
                principalTable: "lkp_Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_com_Commission_com_CommissionStatement_CommissionStatementId",
                table: "com_Commission");

            migrationBuilder.DropForeignKey(
                name: "FK_com_CommissionError_com_CommissionStatement_CommissionStatementId",
                table: "com_CommissionError");

            migrationBuilder.DropForeignKey(
                name: "FK_com_CommissionError_mem_Member_MemberId",
                table: "com_CommissionError");

            migrationBuilder.DropForeignKey(
                name: "FK_com_CommissionError_mem_Policy_PolicyId",
                table: "com_CommissionError");

            migrationBuilder.DropForeignKey(
                name: "FK_com_CommissionStatement_lkp_Company_CompanyId",
                table: "com_CommissionStatement");

            migrationBuilder.DropIndex(
                name: "IX_com_CommissionStatement_CompanyId",
                table: "com_CommissionStatement");

            migrationBuilder.DropIndex(
                name: "IX_com_CommissionError_CommissionStatementId",
                table: "com_CommissionError");

            migrationBuilder.DropIndex(
                name: "IX_com_CommissionError_MemberId",
                table: "com_CommissionError");

            migrationBuilder.DropIndex(
                name: "IX_com_CommissionError_PolicyId",
                table: "com_CommissionError");

            migrationBuilder.DropIndex(
                name: "IX_com_Commission_CommissionStatementId",
                table: "com_Commission");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "com_CommissionStatement");

            migrationBuilder.DropColumn(
                name: "Processed",
                table: "com_CommissionStatement");
        }
    }
}
