using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class policyTypeCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "lkp_PolicyType",
                nullable: false,
                defaultValue: "investment");

            migrationBuilder.UpdateData("lkp_PolicyType", "Id", "a98bb718-4acb-4fad-afe9-5fbba00203b9", "Code", "investment");
            migrationBuilder.UpdateData("lkp_PolicyType", "Id", "f3d877b4-1800-4711-8cc9-35169f8bd60b", "Code", "life_insurance");
            migrationBuilder.UpdateData("lkp_PolicyType", "Id", "a90a5869-4da5-4cce-8973-9a8194c2bdcb", "Code", "short_term");
            migrationBuilder.UpdateData("lkp_PolicyType", "Id", "023107f5-97a6-456d-9182-7bbda72ca82a", "Code", "medical_cover");
            migrationBuilder.UpdateData("lkp_PolicyType", "Id", "3d991459-2043-46b9-9357-5446a993b81d", "Code", "rewards");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "lkp_PolicyType");
        }
    }
}
