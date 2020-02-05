using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class indexUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "INDEX_Commission_UserId_CommissionStatementId",
                table: "com_Commission");

            migrationBuilder.CreateIndex(
                name: "INDEX_Commission_UserId_CommissionStatementId",
                table: "com_Commission",
                columns: new[] { "UserId", "CommissionStatementId", "CommissionTypeId", "PolicyId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "INDEX_Commission_UserId_CommissionStatementId",
                table: "com_Commission");

            // migrationBuilder.CreateIndex(
            //     name: "INDEX_Commission_UserId_CommissionStatementId",
            //     table: "com_Commission",
            //     columns: new[] { "UserId", "CommissionStatementId" })
            //     .Annotation("SqlServer:IncludeIndex", "[AmountIncludingVAT], [CommissionTypeId], [PolicyId], [VAT]");
        }
    }
}
