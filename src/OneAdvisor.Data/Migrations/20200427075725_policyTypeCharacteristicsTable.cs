using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class policyTypeCharacteristicsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PolicyTypeCharacteristics",
                table: "clt_PolicyProductType",
                nullable: false,
                defaultValueSql: "'[]'");

            migrationBuilder.CreateTable(
                name: "clt_PolicyTypeCharacteristic",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PolicyTypeId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    DisplayOrder = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clt_PolicyTypeCharacteristic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clt_PolicyTypeCharacteristic_clt_PolicyType_PolicyTypeId",
                        column: x => x.PolicyTypeId,
                        principalTable: "clt_PolicyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("0269860e-a5ab-7912-e65a-539c124d5593"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("062d7233-f743-9e5a-8c07-d5580bfa11a4"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("0c55f316-f446-a8f8-488c-ac1eb587a9c9"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("178c71d8-f378-fc92-6347-149108b4f24f"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("273e862c-abd5-ac36-3bb7-31ea2e18cb9d"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("3b7ccd1e-44b5-d81e-b6b4-18c56c1c077f"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("4df79496-16cd-9375-eb86-3cbcd8eb47fc"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("5541cf6c-50ef-5fcd-f584-6673a125c817"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("62007d95-7d61-4182-b998-9ffb4c5fda0b"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("67c1d0a3-b5b4-3c23-4256-4e79266f5378"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("95b24f26-5d16-0289-ea4d-754603c3e950"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("988d7de4-1760-f6e8-b9c2-c68e4d95e7e2"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("a202bce5-8e20-a795-1a38-c93b0cfd41ac"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("bdb36139-07a5-13aa-7431-128329c3bb28"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("da086441-91a9-6e5e-5ad6-3167b2076329"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "clt_PolicyProductType",
                keyColumn: "Id",
                keyValue: new Guid("f6db6be4-2672-7063-6920-ae95a0130b73"),
                column: "PolicyTypeCharacteristics",
                value: "[]");

            migrationBuilder.CreateIndex(
                name: "IX_clt_PolicyTypeCharacteristic_PolicyTypeId",
                table: "clt_PolicyTypeCharacteristic",
                column: "PolicyTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "clt_PolicyTypeCharacteristic");

            migrationBuilder.DropColumn(
                name: "PolicyTypeCharacteristics",
                table: "clt_PolicyProductType");
        }
    }
}
