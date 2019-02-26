using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class useCaseLongKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE from dir_RoleToUseCase");
            migrationBuilder.Sql("DELETE from dir_UseCase");

            migrationBuilder.DropForeignKey(
                name: "FK_dir_RoleToUseCase_dir_UseCase_UseCaseId",
                table: "dir_RoleToUseCase");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "dir_UseCase",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "UseCaseId",
                table: "dir_RoleToUseCase",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 32);

            migrationBuilder.AddForeignKey(
                name: "FK_dir_RoleToUseCase_dir_UseCase_UseCaseId",
                table: "dir_RoleToUseCase",
                column: "UseCaseId",
                principalTable: "dir_UseCase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "dir_UseCase",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "UseCaseId",
                table: "dir_RoleToUseCase",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 256);
        }
    }
}
