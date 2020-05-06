using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class clearOrganisationsFunds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE dir_Organisation SET Config = JSON_MODIFY(Config, '$.Funds', JSON_QUERY('[]'))");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
