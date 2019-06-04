using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class userIdSplitGroupOnCommissionFKs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_com_Commission_UserId",
                table: "com_Commission",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission",
                column: "UserId",
                principalTable: "idn_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_com_Commission_idn_User_UserId",
                table: "com_Commission");

            migrationBuilder.DropIndex(
                name: "IX_com_Commission_UserId",
                table: "com_Commission");
        }
    }
}
