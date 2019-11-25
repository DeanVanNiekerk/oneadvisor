# OneAdvisor Database

## Pre-requisits

1. Docker

## SQL Server Docker Setup

1. Download Sql2017 image
   - `docker pull mcr.microsoft.com/mssql/server:2017-latest`
1. Setup container
   - `docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=udhG#2fDVIB%9896I#' \ -p 1433:1433 --name sql2017 \ -d mcr.microsoft.com/mssql/server:2017-latest`
1. Set new sa password
   - `docker exec -it sql2017 /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'udhG#2fDVIB%9896I#' -Q 'ALTER LOGIN SA WITH PASSWORD="2x&%bLn3c47Y!y&hv7"'`
1. Execute sql in container
   - `docker exec -it sql2017 "bash"`
   - `/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '2x&%bLn3c47Y!y&hv7'`
1. Connection string will be
   - `Server=127.0.0.1,1433;Database=OneAdvisor;User ID=sa;Password=2x&%bLn3c47Y!y&hv7`
1. Links:
   - https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker
   - https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode?view=sql-server-2017

## Updating the Database

> Before starting: Check the connection string in the `OneAdvisor.Data/DataContextFactory.cs` file is pointing to the appropriate database

- Run `dotnet ef database update`

## Updating the Database Scheme

> NB: make sure the API (`src/oneadvisor/api`) is not running in watch mode otherwise the migration will be applied automatically

- Update relevant Entities in the OneAdvisor.Data project
  - Run `dotnet ef migrations add {migrationDescription}`
    - For example `dotnet ef migrations add addMiddleNameToClientTable`
  - A migration should now have been added to the Migrations folder, review the migration and make any necessary changes
  - Now apply the migration to the database by running `dotnet ef database update`
- More info [here](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)

### Rollback to Migration

- `dotnet ef database update {migrationName}`

### Helpers

## Adding a new Use Case

1. Update SeedData.cs
1. Update DbInitializer.cs
1. Add migration
1. Add RoleToUseCase record (see below)

#### Up()

```c#
migrationBuilder.Sql(@"
INSERT INTO dir_RoleToUseCase
    SELECT Id, 'com_view_commission_allocations'
    FROM idn_Role
    WHERE Name = 'com_administrator'

INSERT INTO dir_RoleToUseCase
    SELECT Id, 'com_edit_commission_allocations'
    FROM idn_Role
    WHERE Name = 'com_administrator'
");
```

#### Down()

```c#
migrationBuilder.DeleteData(
    table: "dir_RoleToUseCase",
    keyColumn: "UseCaseId",
    keyValue: "com_edit_commission_allocations");
```

### Money Columns

`CommissionTypeId = table.Column<Guid>(type: "Money", nullable: false),`

See: `namespace OneAdvisor.Data.Entities.Commission.Mappings`
