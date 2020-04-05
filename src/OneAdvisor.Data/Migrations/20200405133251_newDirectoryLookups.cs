using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class newDirectoryLookups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    Name = table.Column<string>(nullable: false)
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
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("27da6f44-891c-46b5-a215-6120eef79ac3"), "Funeral Benefits" },
                    { new Guid("009c5cec-9b9e-451f-98a9-8335671dc480"), "Planning for Medical Benefits" },
                    { new Guid("d016b488-c4f8-47ff-a833-626b476648d4"), "Planning for Business Assurance" },
                    { new Guid("96dadc7a-7b5a-4fa0-bea8-8423335d7c45"), "Employee Benefits" },
                    { new Guid("68523839-e035-43e2-a8e3-f54eaa273750"), "Investment planning" },
                    { new Guid("04815a0f-6102-47db-8a5c-e28baa9cf428"), "Planning for retirement" },
                    { new Guid("7f3eb0b1-5431-4501-a257-f6c76b96f17a"), "Planning at retirement" },
                    { new Guid("dbc296a3-34d3-4102-a5c0-c84061d88c3d"), "Wills" },
                    { new Guid("b2435736-8fa7-4b34-a7b8-ee08f949e863"), "Risk Planning" },
                    { new Guid("f8d0f35b-9eb5-4be4-b2ab-0a9c3547360d"), "Full financial needs analysis" },
                    { new Guid("e3751712-0324-4be4-b2dc-332890e72b0c"), "Savings planning" },
                    { new Guid("44cc8294-b725-4d34-9900-fe662365c475"), "Medical Gap Cover" }
                });

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"),
                column: "ColourHex",
                value: "#005A38");

            migrationBuilder.InsertData(
                table: "dir_LicenseCategory",
                columns: new[] { "Id", "Code", "Name" },
                values: new object[,]
                {
                    { new Guid("11dd813b-9869-4ccf-a049-c8140d8652a5"), "1.2", "Short-term Insurance Personal Lines" },
                    { new Guid("9a6f6966-261c-4af5-87a9-1abf49d49032"), "2.1", "Long-term Insurance" },
                    { new Guid("5166c9c8-3532-4c16-abad-c992736117c8"), "2.1.1", "Subcategory B1" },
                    { new Guid("0721978d-ff2d-483d-a6a2-6dd90d665082"), "2.1.2", "Subcategory B2" },
                    { new Guid("a2654558-db31-4760-a398-bb4e3232bb2e"), "2.2", "Long-term Insurance subcategory C" },
                    { new Guid("b3001b48-7d25-4c47-a696-24ecebea5aa6"), "2.3", "Retail Pension Benefits" },
                    { new Guid("6b828217-d41a-4859-92dd-f99d910dd2c3"), "2.4", "Pension Fund Benefits" },
                    { new Guid("3c028460-cfb6-4cdb-be5e-5884a3ea2437"), "2.5", "Securities and instruments: Shares" },
                    { new Guid("47427236-b3c8-4b8d-ab02-aa5bafe6b4df"), "2.6", "Securities and Instruments: Money market instruments" },
                    { new Guid("1c5579f2-4aae-4955-bc9c-afb23b8915a3"), "2.7", "Securities and Instruments: Debentures and securitised debt" },
                    { new Guid("3b4c350f-4ed0-4232-a920-b890a17ac929"), "2.8", "Securities and Instruments: Warrants, certificates and other instruments acknowledging debt" },
                    { new Guid("a8bb6484-fe26-49ed-bbb5-06f58e7918cd"), "2.9", "Securities and Instruments: Bonds" },
                    { new Guid("ce0f9141-d378-4cbe-8ca7-4ce32f87865c"), "2.10", "Securities and Instruments: Derivative instruments excluding warrants" },
                    { new Guid("b3425646-8ccc-465d-a24e-dcbde9b2c17f"), "2.11", "Participatory Interests in one or more collective Investments schemes" },
                    { new Guid("f914dfb2-5897-410f-8bde-07ff1a30097f"), "2.12", "Forex Investment Business" },
                    { new Guid("9bd68901-0ebc-4d43-b3f6-47c540e2b80c"), "2.13", "Long-term Deposits" },
                    { new Guid("627bc981-dcc8-4c7e-8aae-d4fb8cab0f26"), "1.19", "Friendly Society Benefits" },
                    { new Guid("d30bca0f-7f36-4bb2-aefa-c01c1e8ef411"), "1.1", "Long-term Insurance subcategory A" },
                    { new Guid("2f09b00f-2db2-40ec-990a-0092caeec303"), "1.18", "Short-term Deposits" },
                    { new Guid("a5570af8-49df-44ac-abe8-4669f1c25458"), "1.16", "Health Service Benefits" },
                    { new Guid("2529467c-5377-4068-8e80-04c2bb9e1ef9"), "1.3", "Long-term Insurance" },
                    { new Guid("3d4da6d1-2091-49f6-9fc4-b82deb92a0fa"), "1.3.1", "Subcategory B1" },
                    { new Guid("392b4516-c3c1-4ff1-ae1c-86f913336897"), "1.3.2", "Subcategory B2" },
                    { new Guid("d119563b-958d-4f97-ba9c-e0b28e4a3c86"), "1.4", "Long-term Insurance subcategory C" },
                    { new Guid("53e8b4c6-271f-4f30-af1e-55a9557539ad"), "1.5", "Retail Pension Benefits" },
                    { new Guid("cc666ccc-5dbb-49fc-8c71-9780765f47d4"), "1.6", "Short-term Insurance Commercial Lines" },
                    { new Guid("78d01ab4-b2d7-4803-a49a-f095eb6897b5"), "1.7", "Pension Fund Benefits" },
                    { new Guid("e998959e-041d-4395-858f-8816f88f7999"), "2.14", "Short-term Deposits" },
                    { new Guid("d04c9714-bb11-4f6d-932a-7bdcde1c0f70"), "1.9", "Securities and Instruments: Money market instruments" },
                    { new Guid("4eabb7cc-d69f-4e2b-8084-29c0f702dfe3"), "1.10", "Securities and Instruments: Debentures and securitised debt" },
                    { new Guid("0dc7038b-69fb-4721-ac72-745b36412ce2"), "1.11", "Securities and Instruments: Warrants, certificates and other instruments acknowledging debt" },
                    { new Guid("f0f97920-c0c0-47fc-805b-ac012c18489d"), "1.12", "Securities and Instruments: Bonds" },
                    { new Guid("c78506dc-7fb7-42a2-9470-5244dd39e176"), "1.13", "Securities and Instruments: Derivative instruments excluding warrants" },
                    { new Guid("f391548e-9397-4381-9e1f-0f5663b9d64f"), "1.14", "Participatory Interests in one or more collective Investments schemes" },
                    { new Guid("1a0da339-324b-4df0-bfd5-141459b52603"), "1.15", "Forex Investment Business" },
                    { new Guid("0dc75e74-e2a3-4ae9-b2fa-3d81df0e1a9e"), "1.17", "Long-term Deposits" },
                    { new Guid("49e79bc6-1ea0-42e8-8d7c-72109967d51e"), "1.8", "Securities and instruments: Shares" }
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

            migrationBuilder.UpdateData(
                table: "dir_Application",
                keyColumn: "Id",
                keyValue: new Guid("ef1bb77d-981a-743f-9543-ec36f396536c"),
                column: "ColourHex",
                value: "#00C89A");
        }
    }
}
