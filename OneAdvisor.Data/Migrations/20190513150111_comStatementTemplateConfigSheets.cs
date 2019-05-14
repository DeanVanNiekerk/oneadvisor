using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class comStatementTemplateConfigSheets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE com_CommissionStatementTemplate SET Config = '{\"Sheets\":[{\"Position\": 1,\"Config\":' + Config + '}]}'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
