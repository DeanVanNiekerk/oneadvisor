using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class userTypeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserTypeId",
                table: "idn_User",
                nullable: false,
                defaultValueSql: "'70a67bcf-f8d3-8fe7-9c3e-b4b8b9bf9cc8'");

            migrationBuilder.CreateTable(
                name: "dir_UserType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    DisplayOrder = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_UserType", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "dir_UserType",
                columns: new[] { "Id", "DisplayOrder", "Name" },
                values: new object[] { new Guid("70a67bcf-f8d3-8fe7-9c3e-b4b8b9bf9cc8"), 1, "Broker" });

            migrationBuilder.InsertData(
                table: "dir_UserType",
                columns: new[] { "Id", "DisplayOrder", "Name" },
                values: new object[] { new Guid("442f9050-bde4-9aa6-75f5-a9a7e5f84a5c"), 2, "Admin" });

            migrationBuilder.InsertData(
                table: "dir_UserType",
                columns: new[] { "Id", "DisplayOrder", "Name" },
                values: new object[] { new Guid("d3155541-8b53-64d7-343e-57d6e5c959db"), 3, "Support" });

            migrationBuilder.CreateIndex(
                name: "IX_idn_User_UserTypeId",
                table: "idn_User",
                column: "UserTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_idn_User_dir_UserType_UserTypeId",
                table: "idn_User",
                column: "UserTypeId",
                principalTable: "dir_UserType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_idn_User_dir_UserType_UserTypeId",
                table: "idn_User");

            migrationBuilder.DropTable(
                name: "dir_UserType");

            migrationBuilder.DropIndex(
                name: "IX_idn_User_UserTypeId",
                table: "idn_User");

            migrationBuilder.DropColumn(
                name: "UserTypeId",
                table: "idn_User");
        }
    }
}
