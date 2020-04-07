using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newAppsAndLookups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VATRegistered",
                table: "dir_Organisation");

            migrationBuilder.DropColumn(
                name: "VATRegistrationDate",
                table: "dir_Organisation");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationIds",
                table: "dir_Organisation",
                nullable: false,
                defaultValueSql: "'[]'");

            migrationBuilder.AddColumn<string>(
                name: "ColourHex",
                table: "dir_Application",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "dir_AdviceScope",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_AdviceScope", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_AdviceService",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    DisplayOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_AdviceService", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dir_LicenseCategory",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Code = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dir_LicenseCategory", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "dir_AdviceScope",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("f1d1bdcd-83cc-4ae9-9c33-9a4de93f9af1"), "Estate Planning" },
                    { new Guid("a17d7c4d-4159-4cd0-a37d-7d0d006d11f6"), "Retirement Planning" },
                    { new Guid("e26f2a86-832e-47c5-a6e4-00920102ce0c"), "Investment Planning" },
                    { new Guid("b415119f-4070-4ddf-8329-c946496bcb2f"), "Medical Benefits" },
                    { new Guid("76c1dc96-ba96-4136-ac70-386d355354da"), "Short Term Insurance" },
                    { new Guid("b9336610-828b-490c-9b4d-b4478d3c958b"), "Fiduciary services" }
                });

            migrationBuilder.InsertData(
                table: "dir_AdviceService",
                columns: new[] { "Id", "DisplayOrder", "Name" },
                values: new object[,]
                {
                    { new Guid("247c5a3b-cb44-4bd2-5881-d8e146ab75ec"), 4, "Risk Planning for for dread disease/trauma " },
                    { new Guid("d016b488-c4f8-47ff-a833-626b476648d4"), 10, "Planning for Business Assurance" },
                    { new Guid("96dadc7a-7b5a-4fa0-bea8-8423335d7c45"), 9, "Employee Benefits" },
                    { new Guid("68523839-e035-43e2-a8e3-f54eaa273750"), 8, "Investment planning" },
                    { new Guid("e3751712-0324-4be4-b2dc-332890e72b0c"), 7, "Savings planning" },
                    { new Guid("7f3eb0b1-5431-4501-a257-f6c76b96f17a"), 6, "Planning at retirement" },
                    { new Guid("b2435736-8fa7-4b34-a7b8-ee08f949e863"), 2, "Risk Planning for death" },
                    { new Guid("44cc8294-b725-4d34-9900-fe662365c475"), 14, "Medical Gap Cover" },
                    { new Guid("6ef0e93b-a4fd-babc-030e-09c7ab293b88"), 3, "Risk Planning for disability" },
                    { new Guid("009c5cec-9b9e-451f-98a9-8335671dc480"), 11, "Planning for Medical Benefits" },
                    { new Guid("f8d0f35b-9eb5-4be4-b2ab-0a9c3547360d"), 1, "Full financial needs analysis" },
                    { new Guid("dbc296a3-34d3-4102-a5c0-c84061d88c3d"), 13, "Wills" },
                    { new Guid("04815a0f-6102-47db-8a5c-e28baa9cf428"), 5, "Planning for retirement" },
                    { new Guid("27da6f44-891c-46b5-a215-6120eef79ac3"), 12, "Funeral Benefits" }
                });

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("2fca4500-9142-4940-aaf4-b18925c96d66"),
                column: "ColourHex",
                value: "#2A2A72");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("605ea52c-3627-48e2-8f7c-4819c5ea555b"),
                column: "ColourHex",
                value: "#009FFD");

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9"),
                column: "ColourHex",
                value: "#CC3F0C");

            migrationBuilder.InsertData(
                table: "dir_Application",
                columns: new[] { "Id", "ColourHex", "Name" },
                values: new object[,]
                {
                    { new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"), "#005A38", "Compliance" },
                    { new Guid("ca35b7ac-351a-0ff1-5d45-9bee6de9e051"), "#AE1827", "Invest" }
                });

            migrationBuilder.InsertData(
                table: "dir_LicenseCategory",
                columns: new[] { "Id", "Code", "Name" },
                values: new object[,]
                {
                    { new Guid("a8626ca9-acfd-4476-b8bd-d2c1659fe67f"), "1.3", "Long-term Insurance" },
                    { new Guid("95af0aa3-0048-4a92-aae6-9bf6a08ea269"), "2.1.2", "Subcategory B2" },
                    { new Guid("60314bbd-1330-4893-b81f-704372a62915"), "2.2", "Long-term Insurance subcategory C" },
                    { new Guid("61616b5b-d0c9-4418-b5e1-459bf50501e4"), "2.3", "Retail Pension Benefits" },
                    { new Guid("554467e1-caf9-4703-8ae8-65c802ca7964"), "2.4", "Pension Fund Benefits" },
                    { new Guid("bcbaf86e-dd7a-4649-a244-32e7a3811bca"), "2.5", "Securities and instruments: Shares" },
                    { new Guid("69bd2568-b0c8-408b-b43b-9d2979f26707"), "2.6", "Securities and Instruments: Money market instruments" },
                    { new Guid("0350fdd6-bf18-4ad0-b876-e74000fcecaa"), "2.7", "Securities and Instruments: Debentures and securitised debt" },
                    { new Guid("0c205964-0bff-4f59-817c-3274e07941f7"), "2.8", "Securities and Instruments: Warrants, certificates and other instruments acknowledging debt" },
                    { new Guid("d12d9ba6-2618-4294-9357-17bc439fc80e"), "2.9", "Securities and Instruments: Bonds" },
                    { new Guid("04fe22be-ed1b-4221-8b87-3f6b3e64138d"), "2.10", "Securities and Instruments: Derivative instruments excluding warrants" },
                    { new Guid("d91e5fbc-b425-48c2-8c4d-d38dadb2c372"), "2.11", "Participatory Interests in one or more collective Investments schemes" },
                    { new Guid("261ba3b0-be07-48d7-83e1-70faaed8298c"), "2.12", "Forex Investment Business" },
                    { new Guid("d65982e7-12f0-40e5-83cb-3c3035b21bb8"), "2.13", "Long-term Deposits" },
                    { new Guid("f82de6cf-6106-4bc5-9c02-938b069deb66"), "2.14", "Short-term Deposits" },
                    { new Guid("89bd2ad2-3e82-4ea9-9c70-2c1dcb7be2df"), "2.1.1", "Subcategory B1" },
                    { new Guid("f91cec3f-1a03-4d6c-8ec9-0d2c8f1b0080"), "2.1", "Long-term Insurance" },
                    { new Guid("be5c076f-a279-49f3-bac2-eac51106d872"), "1.19", "Friendly Society Benefits" },
                    { new Guid("21664afe-a0ff-4dcf-9618-8cd19ad6022e"), "1.18", "Short-term Deposits" },
                    { new Guid("1ab9fac3-6171-4653-8618-e627f95d3759"), "1.3.1", "Subcategory B1" },
                    { new Guid("75719355-6db5-4620-9537-b710bf7d71e8"), "1.3.2", "Subcategory B2" },
                    { new Guid("37059d66-8d91-424d-9c76-146e28ce01d4"), "1.4", "Long-term Insurance subcategory C" },
                    { new Guid("83ba73cf-c0b0-4c55-8ffb-e11098289b7e"), "1.5", "Retail Pension Benefits" },
                    { new Guid("dc03a55e-41eb-4284-80ab-2cafdf6a60c4"), "1.6", "Short-term Insurance Commercial Lines" },
                    { new Guid("50fb5d14-10d7-40f1-9e3d-b842fe756989"), "1.1", "Long-term Insurance subcategory A" },
                    { new Guid("19ade5aa-81e0-456e-aff2-84a4f8b58c44"), "1.8", "Securities and instruments: Shares" },
                    { new Guid("de6e5ba3-82a8-4622-bf21-bf13ae3df492"), "1.2", "Short-term Insurance Personal Lines" },
                    { new Guid("b5c7d31a-177b-491a-a142-b1662febc6bf"), "1.9", "Securities and Instruments: Money market instruments" },
                    { new Guid("e1b47d47-1109-4c6a-bfdf-681dce8fc596"), "1.11", "Securities and Instruments: Warrants, certificates and other instruments acknowledging debt" },
                    { new Guid("e47a4a36-ed52-4d1c-b9c7-080df298d58d"), "1.12", "Securities and Instruments: Bonds" },
                    { new Guid("3f35cf49-fb8c-48a7-a7ce-7e2de19eb0ad"), "1.13", "Securities and Instruments: Derivative instruments excluding warrants" },
                    { new Guid("bf1c2f4e-9444-4795-b245-059f3bd1f11f"), "1.14", "Participatory Interests in one or more collective Investments schemes" },
                    { new Guid("bdca849f-ff58-4dec-a3f8-2c2397fcec1d"), "1.15", "Forex Investment Business" },
                    { new Guid("01ef566a-fd9a-4ed7-a166-45a15bd0ff05"), "1.16", "Health Service Benefits" },
                    { new Guid("d7c3a276-53a7-40be-b596-26eceec8b801"), "1.17", "Long-term Deposits" },
                    { new Guid("6b7b8c1d-9d05-44ac-9afc-2b4594dfae9f"), "1.10", "Securities and Instruments: Debentures and securitised debt" },
                    { new Guid("34660bf9-8396-4bfd-8edb-481ce214a6b9"), "1.7", "Pension Fund Benefits" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dir_AdviceScope");

            migrationBuilder.DropTable(
                name: "dir_AdviceService");

            migrationBuilder.DropTable(
                name: "dir_LicenseCategory");

            migrationBuilder.DeleteData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ca35b7ac-351a-0ff1-5d45-9bee6de9e051"));

            migrationBuilder.DeleteData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"));

            migrationBuilder.DropColumn(
                name: "ApplicationIds",
                table: "dir_Organisation");

            migrationBuilder.DropColumn(
                name: "ColourHex",
                table: "dir_Application");

            migrationBuilder.AddColumn<bool>(
                name: "VATRegistered",
                table: "dir_Organisation",
                type: "bit",
                nullable: false,
                defaultValueSql: "0");

            migrationBuilder.AddColumn<DateTime>(
                name: "VATRegistrationDate",
                table: "dir_Organisation",
                type: "datetime2",
                nullable: true);
        }
    }
}
