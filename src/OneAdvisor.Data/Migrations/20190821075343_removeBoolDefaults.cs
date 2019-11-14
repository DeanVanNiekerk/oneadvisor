using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class removeBoolDefaults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Published",
                table: "dir_ChangeLog",
                nullable: false,
                oldClrType: typeof(bool),
                oldDefaultValueSql: "0");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "clt_Policy",
                nullable: false,
                oldClrType: typeof(bool),
                oldDefaultValueSql: "1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Published",
                table: "dir_ChangeLog",
                nullable: false,
                defaultValueSql: "0",
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "clt_Policy",
                nullable: false,
                defaultValueSql: "1",
                oldClrType: typeof(bool));
        }
    }
}
