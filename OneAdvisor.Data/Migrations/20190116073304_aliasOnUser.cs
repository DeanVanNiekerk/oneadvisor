﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class aliasOnUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [mem_MemberPolicy]", true);
            migrationBuilder.Sql("DELETE FROM [dir_User]", true);

            migrationBuilder.DropTable(
                name: "dir_UserAlias");

            migrationBuilder.AddColumn<string>(
                name: "Aliases",
                table: "dir_User",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aliases",
                table: "dir_User");

            migrationBuilder.CreateTable(
                name: "dir_UserAlias",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_UserAlias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dir_UserAlias_dir_User_UserId",
                        column: x => x.UserId,
                        principalTable: "dir_User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_dir_UserAlias_UserId",
                table: "dir_UserAlias",
                column: "UserId");
        }
    }
}
