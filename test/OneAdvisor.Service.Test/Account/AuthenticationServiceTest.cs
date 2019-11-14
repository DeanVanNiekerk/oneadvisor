using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Account
{
    // [TestClass]
    // public class AuthenticationServiceTest
    // {
    //     [Fact]
    //     public async Task GetScope_OrganisationLevel()
    //     {
    //         var options = TestHelper.GetDbContext("GetScope_OrganisationLevel");

    //         var user = TestHelper.InsertDefaultUserDetailed(options, Scope.Organisation);

    //         using (var context = new DataContext(options))
    //         {
    //             var service = new AuthenticationService(context, null);

    //             //When
    //             var scope = await service.GetScope(user.User.Id);

    //             Assert.Equal(user.User.Id, scope.UserId);
    //             Assert.Equal(user.Branch.Id, scope.BranchId);
    //             Assert.Equal(user.Organisation.Id, scope.OrganisationId);
    //             Assert.Equal(Scope.Organisation, scope.Scope);
    //         }
    //     }

    //     [Fact]
    //     public async Task GetScope_BranchLevel()
    //     {
    //         var options = TestHelper.GetDbContext("GetScope_BranchLevel");

    //         var user = TestHelper.InsertDefaultUserDetailed(options, Scope.Branch);

    //         using (var context = new DataContext(options))
    //         {
    //             var service = new AuthenticationService(context, null);

    //             //When
    //             var scope = await service.GetScope(user.User.Id);

    //             Assert.Equal(user.User.Id, scope.UserId);
    //             Assert.Equal(user.Branch.Id, scope.BranchId);
    //             Assert.Equal(user.Organisation.Id, scope.OrganisationId);
    //             Assert.Equal(Scope.Branch, scope.Scope);
    //         }
    //     }

    //     [Fact]
    //     public async Task GetScope_UserLevel()
    //     {
    //         var options = TestHelper.GetDbContext("GetScope_UserLevel");

    //         var user = TestHelper.InsertDefaultUserDetailed(options, Scope.User);

    //         using (var context = new DataContext(options))
    //         {
    //             var service = new AuthenticationService(context, null);

    //             //When
    //             var scope = await service.GetScope(user.User.Id);

    //             Assert.Equal(user.User.Id, scope.UserId);
    //             Assert.Equal(user.Branch.Id, scope.BranchId);
    //             Assert.Equal(user.Organisation.Id, scope.OrganisationId);
    //             Assert.Equal(Scope.User, scope.Scope);
    //         }
    //     }

    // }
}