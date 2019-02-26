using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class comStatmentTemplateTable2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CommissionStatementTemplateEntity",
                table: "CommissionStatementTemplateEntity");

            migrationBuilder.RenameTable(
                name: "CommissionStatementTemplateEntity",
                newName: "com_CommissionStatementTemplate");

            migrationBuilder.AddPrimaryKey(
                name: "PK_com_CommissionStatementTemplate",
                table: "com_CommissionStatementTemplate",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_com_CommissionStatementTemplate",
                table: "com_CommissionStatementTemplate");

            migrationBuilder.RenameTable(
                name: "com_CommissionStatementTemplate",
                newName: "CommissionStatementTemplateEntity");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CommissionStatementTemplateEntity",
                table: "CommissionStatementTemplateEntity",
                column: "Id");
        }
    }
}
