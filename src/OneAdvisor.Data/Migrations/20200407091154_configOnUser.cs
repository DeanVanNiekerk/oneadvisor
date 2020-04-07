using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class configOnUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Config",
                table: "idn_User",
                nullable: false,
                defaultValueSql: "'{ }'");

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("009c5cec-9b9e-451f-98a9-8335671dc480"),
                column: "DisplayOrder",
                value: 11);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("04815a0f-6102-47db-8a5c-e28baa9cf428"),
                column: "DisplayOrder",
                value: 5);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("247c5a3b-cb44-4bd2-5881-d8e146ab75ec"),
                column: "DisplayOrder",
                value: 4);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("27da6f44-891c-46b5-a215-6120eef79ac3"),
                column: "DisplayOrder",
                value: 12);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("44cc8294-b725-4d34-9900-fe662365c475"),
                column: "DisplayOrder",
                value: 14);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("68523839-e035-43e2-a8e3-f54eaa273750"),
                column: "DisplayOrder",
                value: 8);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("6ef0e93b-a4fd-babc-030e-09c7ab293b88"),
                column: "DisplayOrder",
                value: 3);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("7f3eb0b1-5431-4501-a257-f6c76b96f17a"),
                column: "DisplayOrder",
                value: 6);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("96dadc7a-7b5a-4fa0-bea8-8423335d7c45"),
                column: "DisplayOrder",
                value: 9);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("b2435736-8fa7-4b34-a7b8-ee08f949e863"),
                column: "DisplayOrder",
                value: 2);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("d016b488-c4f8-47ff-a833-626b476648d4"),
                column: "DisplayOrder",
                value: 10);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("dbc296a3-34d3-4102-a5c0-c84061d88c3d"),
                column: "DisplayOrder",
                value: 13);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("e3751712-0324-4be4-b2dc-332890e72b0c"),
                column: "DisplayOrder",
                value: 7);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("f8d0f35b-9eb5-4be4-b2ab-0a9c3547360d"),
                column: "DisplayOrder",
                value: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Config",
                table: "idn_User");

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("009c5cec-9b9e-451f-98a9-8335671dc480"),
                column: "DisplayOrder",
                value: 11);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("04815a0f-6102-47db-8a5c-e28baa9cf428"),
                column: "DisplayOrder",
                value: 5);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("247c5a3b-cb44-4bd2-5881-d8e146ab75ec"),
                column: "DisplayOrder",
                value: 4);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("27da6f44-891c-46b5-a215-6120eef79ac3"),
                column: "DisplayOrder",
                value: 12);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("44cc8294-b725-4d34-9900-fe662365c475"),
                column: "DisplayOrder",
                value: 14);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("68523839-e035-43e2-a8e3-f54eaa273750"),
                column: "DisplayOrder",
                value: 8);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("6ef0e93b-a4fd-babc-030e-09c7ab293b88"),
                column: "DisplayOrder",
                value: 3);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("7f3eb0b1-5431-4501-a257-f6c76b96f17a"),
                column: "DisplayOrder",
                value: 6);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("96dadc7a-7b5a-4fa0-bea8-8423335d7c45"),
                column: "DisplayOrder",
                value: 9);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("b2435736-8fa7-4b34-a7b8-ee08f949e863"),
                column: "DisplayOrder",
                value: 2);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("d016b488-c4f8-47ff-a833-626b476648d4"),
                column: "DisplayOrder",
                value: 10);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("dbc296a3-34d3-4102-a5c0-c84061d88c3d"),
                column: "DisplayOrder",
                value: 13);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("e3751712-0324-4be4-b2dc-332890e72b0c"),
                column: "DisplayOrder",
                value: 7);

            migrationBuilder.UpdateData(
                table: "dir_AdviceService",
                keyColumn: "Id",
                keyValue: new Guid("f8d0f35b-9eb5-4be4-b2ab-0a9c3547360d"),
                column: "DisplayOrder",
                value: 1);
        }
    }
}
