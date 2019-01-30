using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class auditLog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dir_AuditLog",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AuditData = table.Column<string>(nullable: true),
                    EntityType = table.Column<string>(nullable: true),
                    AuditDate = table.Column<DateTime>(nullable: false),
                    AuditUser = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_AuditLog", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dir_AuditLog");
        }
    }
}
