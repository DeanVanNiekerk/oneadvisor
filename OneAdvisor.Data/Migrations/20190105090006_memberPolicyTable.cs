using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class memberPolicyTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "lkp_Company",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_Company", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "mem_MemberPolicy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    MemberId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Number = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mem_MemberPolicy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mem_MemberPolicy_lkp_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "lkp_Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_mem_MemberPolicy_mem_Member_MemberId",
                        column: x => x.MemberId,
                        principalTable: "mem_Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_mem_MemberPolicy_MemberId",
                table: "mem_MemberPolicy",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_MemberPolicy_CompanyId_Number",
                table: "mem_MemberPolicy",
                columns: new[] { "CompanyId", "Number" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mem_MemberPolicy");

            migrationBuilder.DropTable(
                name: "lkp_Company");
        }
    }
}
