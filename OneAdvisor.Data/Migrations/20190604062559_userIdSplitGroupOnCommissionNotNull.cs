using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class userIdSplitGroupOnCommissionNotNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE com_Commission SET SplitGroupId = NEWID() WHERE SplitGroupId IS NULL");

            migrationBuilder.Sql(@"
            UPDATE c
            SET c.UserId = p.UserId
            FROM com_Commission c
            JOIN clt_Policy p ON c.PolicyId = p.Id
            WHERE c.UserId IS NULL
            ");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "com_Commission",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "SplitGroupId",
                table: "com_Commission",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "com_Commission",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AlterColumn<Guid>(
                name: "SplitGroupId",
                table: "com_Commission",
                nullable: true,
                oldClrType: typeof(Guid));
        }
    }
}
