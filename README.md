# OneAdvisor

## Setup

1. Run ```dotnet restore``` in the root directory to restore dotnet packages
1. Run ```npm install``` in the web/ClientApp directory to install node dependancies

## Running the application

> In order to run in development mode, set the ASPNETCORE_ENVIRONMENT environment variable to Development

1. Start the api by running ```dotnet run``` in api/ directory
1. Then run the website by running```dotnet run``` in web/ directory

---

## .NET Development

> Below are some notes on using the dotnet cli, the complete documentation can be found [here](https://docs.microsoft.com/en-us/dotnet/core/tools/index?tabs=netcore2x)

### Adding a new project
- In the terminal type ```dotnet new --help``` to get a list of supported project types
- For example to add a class library type ```dotnet new classlib --output OneAdvisor.Model```
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-new?tabs=netcore21) 

### Adding a project to the solution
- In the terminal type ```dotnet sln oneadvisor.sln add {targetProjFolder}/{targetProjFileName}.csproj```
- For example: ```dotnet sln oneadvisor.sln add OneAdvisor.Model/OneAdvisor.Model.csproj```
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-sln) 

### Adding a reference to a project
- In the terminal type ```dotnet add --help``` for argument info
- To add a reference to an oneadvisor library, firstly cd into the project directory that you would like to add the reference to.
- Then type ```dotnet add reference ../{targetProjFolder}/{targetProjFileName}.csproj```
- For example: ```dotnet add reference ../OneAdvisor.Model/OneAdvisor.Model.csproj```
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-add-reference) 

### Adding an external package
- Firstly cd into the project directory that you would like to add the reference to.
- Then type ```dotnet add package {packageName}```
- For example: ```dotnet add package Microsoft.EntityFrameworkCore```
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-add-package) 

---

## Entity Framework

### Updating the Database Scheme
- Check the connection string in the ```nzone.Data/DataContextFactory.cs``` file is pointing to the appropriate dev db
- Update Entities in the nzone.Data project
- ```cd``` into the ```nzone.Data``` directory and run ```dotnet ef migrations add {migrationDescription}```
- For example ```dotnet ef migrations add addMiddleNameToClientTable```
- A migration should now have been added to the Migrations folder, review the migration and make any nessisary changes
- Now apply the migration to the database by running ```dotnet ef database update```
- More info [here](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/) 

---

## Bugs

- Api not settings cors if 500