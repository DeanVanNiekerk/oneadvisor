using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class userIdToMemberPolicy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [mem_MemberPolicy]", true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "mem_MemberPolicy",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_mem_MemberPolicy_UserId",
                table: "mem_MemberPolicy",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_mem_MemberPolicy_dir_User_UserId",
                table: "mem_MemberPolicy",
                column: "UserId",
                principalTable: "dir_User",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_mem_MemberPolicy_dir_User_UserId",
                table: "mem_MemberPolicy");

            migrationBuilder.DropIndex(
                name: "IX_mem_MemberPolicy_UserId",
                table: "mem_MemberPolicy");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "mem_MemberPolicy");
        }
    }
}
