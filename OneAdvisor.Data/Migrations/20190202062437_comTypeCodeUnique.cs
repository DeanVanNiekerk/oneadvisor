using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class comTypeCodeUnique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "lkp_CommissionType",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_lkp_CommissionType_Code",
                table: "lkp_CommissionType",
                column: "Code",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_lkp_CommissionType_Code",
                table: "lkp_CommissionType");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "lkp_CommissionType",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
