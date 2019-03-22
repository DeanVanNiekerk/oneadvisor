using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.Members;
using api.Controllers.Member.Merge;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Model.Member.Model.Merge;
using Xunit;

namespace api.Test.Controllers.Member
{
    public class MergeControllerTest
    {
        [Fact]
        public void MemberEditModelComposition()
        {
            Assert.Equal(2, typeof(MergeMembers).PropertyCount());
            Assert.True(typeof(MergeMembers).HasProperty("TargetMember"));
            Assert.True(typeof(MergeMembers).HasProperty("SourceMemberIds"));
        }

        [Fact]
        public async Task Merge()
        {
            var member = new MemberEdit()
            {
                Id = Guid.NewGuid(),
            };
            var merge = new MergeMembers()
            {
                TargetMember = member,
                SourceMemberIds = new List<Guid>() { Guid.NewGuid(), Guid.NewGuid() }
            };

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            MergeMembers merged = null;

            service.Setup(c => c.MergeMembers(It.IsAny<ScopeOptions>(), It.Is<MergeMembers>(m => m == merge)))
                .Callback((ScopeOptions o, MergeMembers m) =>
                {
                    merge = m;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new MergeController(service.Object, authService.Object);

            var actual = await controller.Merge(merge);

            Assert.Same(merge, merged);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}