using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newLookups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PolicyTypeId",
                table: "mem_Policy",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "lkp_ContactType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_ContactType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lkp_PolicyType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lkp_PolicyType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "mem_Contact",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    MemberId = table.Column<Guid>(nullable: false),
                    ContactTypeId = table.Column<Guid>(nullable: false),
                    Value = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mem_Contact", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mem_Contact_lkp_ContactType_ContactTypeId",
                        column: x => x.ContactTypeId,
                        principalTable: "lkp_ContactType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_mem_Contact_mem_Member_MemberId",
                        column: x => x.MemberId,
                        principalTable: "mem_Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_mem_Policy_PolicyTypeId",
                table: "mem_Policy",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Contact_ContactTypeId",
                table: "mem_Contact",
                column: "ContactTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_mem_Contact_MemberId",
                table: "mem_Contact",
                column: "MemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_Policy_lkp_PolicyType_PolicyTypeId",
                table: "mem_Policy",
                column: "PolicyTypeId",
                principalTable: "lkp_PolicyType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_Policy_lkp_PolicyType_PolicyTypeId",
                table: "mem_Policy");

            migrationBuilder.DropTable(
                name: "lkp_PolicyType");

            migrationBuilder.DropTable(
                name: "mem_Contact");

            migrationBuilder.DropTable(
                name: "lkp_ContactType");

            migrationBuilder.DropIndex(
                name: "IX_mem_Policy_PolicyTypeId",
                table: "mem_Policy");

            migrationBuilder.DropColumn(
                name: "PolicyTypeId",
                table: "mem_Policy");
        }
    }
}
