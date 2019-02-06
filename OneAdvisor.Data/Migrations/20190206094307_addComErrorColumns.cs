using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class addComErrorColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsFormatValue",
                table: "com_CommissionError",
                newName: "IsFormatValid");

            migrationBuilder.AddColumn<string>(
                name: "CommissionTypeCode",
                table: "com_CommissionError",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommissionTypeCode",
                table: "com_CommissionError");

            migrationBuilder.RenameColumn(
                name: "IsFormatValid",
                table: "com_CommissionError",
                newName: "IsFormatValue");
        }
    }
}
