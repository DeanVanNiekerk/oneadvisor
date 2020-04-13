using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class orgAppIdDefaults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Give all orgs access to Directory, Client and Commission
            migrationBuilder.Sql("UPDATE dir_Organisation SET ApplicationIds = '[\"66c3b4e8-8a30-4a4b-be4d-3928d12fefe9\",\"605ea52c-3627-48e2-8f7c-4819c5ea555b\",\"2fca4500-9142-4940-aaf4-b18925c96d66\"]'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
