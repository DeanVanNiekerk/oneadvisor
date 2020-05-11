# OneAdvisor

### Prerequisites

1. [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1)
1. [Node.js > 10](https://nodejs.org/en/download/)

### Database

1. Configure database, follow database [README](src/OneAdvisor.Data/README.md)

### API Setup

1. cd into `src/oneadvisor/api/`
1. `dotnet restore`
   - to restore dotnet packages
1. Create an `appSettings.json` file.
   - See `example.appsettings.json`
   - Update settings accordingly.
1. `dotnet watch run`
   - starts the API

(more info in [here](src/oneadvisor/api/README.md))

### Client Setup (Web App)

1. cd into `src/oneadvisor/web/`
1. `npm install`
1. `npm start`

(more info in [here](src/oneadvisor/web/README.md))

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

## dotnet core tools

### Installing tools

- `dotnet tool install -g {package-name}`

### dotnet-outdated - update nuget packages

Install > `dotnet tool install --global dotnet-outdated`

- `dotnet-outdated oneadvisor.sln`
- `dotnet-outdated oneadvisor.sln -u` (will make updates)
- `dotnet-outdated oneadvisor.sln -u:prompt` (will prompt to make updates)

### dotnet-search - seach nuget packages

- `dotnet-search automapper`
  -> `dotnet add package {packageName}`

---

## App Documentation

## Azure Pipelines

- Tasks: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/?view=vsts

## VS Code Extension

See `.vscode/extensions.json`

## Release Notes

```html
<h4>Release: v1.2.7</h4>
<p>Compliance > ROA Invest > General Updates</p>
<p>Compliance > ROA Invest > Risk Sections</p>
```
