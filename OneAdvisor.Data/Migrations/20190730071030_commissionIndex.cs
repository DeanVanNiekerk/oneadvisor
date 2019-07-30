using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class commissionIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropIndex(
            //     name: "IX_com_Commission_UserId",
            //     table: "com_Commission");

            migrationBuilder.CreateIndex(
                name: "INDEX_Commission_UserId_CommissionStatementId",
                table: "com_Commission",
                columns: new[] { "UserId", "CommissionStatementId" })
                .Annotation("SqlServer:IncludeIndex", "[AmountIncludingVAT], [CommissionTypeId], [PolicyId], [VAT]");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "INDEX_Commission_UserId_CommissionStatementId",
                table: "com_Commission");

            // migrationBuilder.CreateIndex(
            //     name: "IX_com_Commission_UserId",
            //     table: "com_Commission",
            //     column: "UserId");
        }
    }
}
