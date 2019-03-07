using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newTableCommissionEarningsType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "lkp_CommissionEarningsType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_CommissionEarningsType", x => x.Id);
                });

            migrationBuilder.InsertData("lkp_CommissionEarningsType", new string[] { "Id", "Name" }, new string[] { "8b42edc0-fac6-e946-c779-9d90a805c294", "Monthly Annuity" });
            migrationBuilder.InsertData("lkp_CommissionEarningsType", new string[] { "Id", "Name" }, new string[] { "e8799015-6f4a-5d45-5be9-0fcd516e0951", "Annual Annuity" });
            migrationBuilder.InsertData("lkp_CommissionEarningsType", new string[] { "Id", "Name" }, new string[] { "e7f98561-f018-3edd-2118-e3646c89e2a2", "Life 1st Years" });
            migrationBuilder.InsertData("lkp_CommissionEarningsType", new string[] { "Id", "Name" }, new string[] { "9f8fc29d-0f1c-b952-d446-79cc3ed967d7", "Once Off Commissions" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "lkp_CommissionEarningsType");
        }
    }
}
