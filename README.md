# OneAdvisor

## Pre-requisits

1. dotnet core SDK 2.2
1. nodejs > 8

## Setup

1. Run `dotnet restore` in the root directory to restore dotnet packages
1. Run `npm install` in the `src/oneadvisor/web/` directory to install node dependancies
1. Initialize database, follow instructions [here](src/OneAdvisor.Data/README.md))

## Running the application

> In order to run in development mode, set the ASPNETCORE_ENVIRONMENT environment variable to Development

1. Create an `appSettings.json` in `src/oneadvisor/api/`. See `src/oneadvisor/api/example.appsettings.json`. Update settings accordingly.
1. Start the api by running `dotnet watch run` in `src/oneadvisor/api/` directory (more info in [here](src/oneadvisor/api/README.md))
1. Then run the website by running `npm start` in `src/oneadvisor/web/` directory (more info in [here](src/oneadvisor/web/README.md))

## Unit Tests

1. Run `dotnet test --filter Category!=Integration`

---

## .NET Core Development

> Below are some notes on using the dotnet cli, the complete documentation can be found [here](https://docs.microsoft.com/en-us/dotnet/core/tools/index?tabs=netcore2x)

### Adding a new project

- In the terminal type `dotnet new --help` to get a list of supported project types
- For example to add a class library type `dotnet new classlib --output OneAdvisor.Model`
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-new?tabs=netcore21)

### Adding a project to the solution

- In the terminal type `dotnet sln oneadvisor.sln add {targetProjFolder}/{targetProjFileName}.csproj`
- For example: `dotnet sln oneadvisor.sln add OneAdvisor.Model/OneAdvisor.Model.csproj`
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-sln)

### Adding a reference to a project

- In the terminal type `dotnet add --help` for argument info
- To add a reference to an oneadvisor library, firstly cd into the project directory that you would like to add the reference to.
- Then type `dotnet add reference ../{targetProjFolder}/{targetProjFileName}.csproj`
- For example: `dotnet add reference ../OneAdvisor.Model/OneAdvisor.Model.csproj`
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-add-reference)

### Adding an external package

- Firstly cd into the project directory that you would like to add the reference to.
- Then type `dotnet add package {packageName}`
- For example: `dotnet add package Microsoft.EntityFrameworkCore`
- More info [here](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-add-package)

---

## Global dotnet core tools

> dotnet tool install -g {package-name}

### dotnet-outdated - update nuget packages

- dotnet-outdated oneadvisor.sln
- dotnet-outdated oneadvisor.sln -u (will make updates)
- dotnet-outdated oneadvisor.sln -u:prompt (will prompt to make updates)

### dotnet-search - seach nuget packages

- dotnet-search automapper
  -> dotnet add package {packageName}

---

## App Documentation

## Azure Pipelines

- Tasks: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/?view=vsts

## VS Code Extension

See `.vscode/extensions.json`
