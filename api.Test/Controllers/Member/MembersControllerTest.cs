using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.Members;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;
using Xunit;

namespace api.Test.Controllers.Member
{
    public class MembersControllerTest
    {
        [Fact]
        public void MemberModelComposition()
        {
            Assert.Equal(12, typeof(OneAdvisor.Model.Member.Model.Member.Member).PropertyCount());
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("Id"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("FirstName"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("LastName"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("MaidenName"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("Initials"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("PreferredName"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("IdNumber"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("DateOfBirth"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("PassportNumber"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("TaxNumber"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("MarritalStatusId"));
            Assert.True(typeof(OneAdvisor.Model.Member.Model.Member.Member).HasProperty("MarriageDate"));
        }

        [Fact]
        public void MemberEditModelComposition()
        {
            Assert.Equal(12, typeof(MemberEdit).PropertyCount());
            Assert.True(typeof(MemberEdit).HasProperty("Id"));
            Assert.True(typeof(MemberEdit).HasProperty("FirstName"));
            Assert.True(typeof(MemberEdit).HasProperty("LastName"));
            Assert.True(typeof(MemberEdit).HasProperty("MaidenName"));
            Assert.True(typeof(MemberEdit).HasProperty("Initials"));
            Assert.True(typeof(MemberEdit).HasProperty("PreferredName"));
            Assert.True(typeof(MemberEdit).HasProperty("IdNumber"));
            Assert.True(typeof(MemberEdit).HasProperty("DateOfBirth"));
            Assert.True(typeof(MemberEdit).HasProperty("PassportNumber"));
            Assert.True(typeof(MemberEdit).HasProperty("TaxNumber"));
            Assert.True(typeof(MemberEdit).HasProperty("MarritalStatusId"));
            Assert.True(typeof(MemberEdit).HasProperty("MarriageDate"));
        }

        [Fact]
        public async Task Index()
        {
            var member = new OneAdvisor.Model.Member.Model.Member.Member()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.Parse("ffa2421d-f77f-4957-bdc5-2e79f7537d22"),
                PassportNumber = "6",
                PreferredName = "7",
                TaxNumber = "8"
            };

            var pagedItems = new PagedItems<OneAdvisor.Model.Member.Model.Member.Member>()
            {
                TotalItems = 1,
                Items = new List<OneAdvisor.Model.Member.Model.Member.Member>()
                {
                    member
                }
            };

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            MemberQueryOptions queryOptions = null;
            service.Setup(c => c.GetMembers(It.IsAny<MemberQueryOptions>()))
                .Callback((MemberQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new MembersController(service.Object, authService.Object);

            var result = await controller.Index("firstName", "desc", 15, 2, "lastName=%van%");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("firstName", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal("%van%", queryOptions.LastName);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<OneAdvisor.Model.Member.Model.Member.Member>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var member = new MemberEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.Parse("ffa2421d-f77f-4957-bdc5-2e79f7537d22"),
                PassportNumber = "6",
                PreferredName = "7",
                TaxNumber = "8"
            };

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetMember(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == member.Id.Value)))
                .ReturnsAsync(member);

            var controller = new MembersController(service.Object, authService.Object);

            var result = await controller.Get(member.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<MemberEdit>(okResult.Value);

            Assert.Same(member, returnValue);
        }

        [Fact]
        public async Task GetPreview()
        {
            var member = new MemberPreview()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                ContactCount = 4,
                PolicyCount = 5
            };

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetMemberPreview(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == member.Id)))
                .ReturnsAsync(member);

            var controller = new MembersController(service.Object, authService.Object);

            var result = await controller.GetPreview(member.Id);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<MemberPreview>(okResult.Value);

            Assert.Same(member, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var member = new MemberEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.Parse("ffa2421d-f77f-4957-bdc5-2e79f7537d22"),
                PassportNumber = "6",
                PreferredName = "7",
                TaxNumber = "8"
            };

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            MemberEdit inserted = null;
            service.Setup(c => c.InsertMember(It.IsAny<ScopeOptions>(), It.Is<MemberEdit>(m => m == member)))
                .Callback((ScopeOptions o, MemberEdit i) =>
                {
                    inserted = i;
                    options = o;
                }
                    )
                .ReturnsAsync(result);

            var controller = new MembersController(service.Object, authService.Object);

            var actual = await controller.Insert(member);

            Assert.Same(member, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var member = new MemberEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.Parse("ffa2421d-f77f-4957-bdc5-2e79f7537d22"),
                PassportNumber = "6",
                PreferredName = "7",
                TaxNumber = "8"
            };

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            MemberEdit updated = null;

            service.Setup(c => c.UpdateMember(It.IsAny<ScopeOptions>(), It.Is<MemberEdit>(m => m == member)))
                .Callback((ScopeOptions o, MemberEdit u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new MembersController(service.Object, authService.Object);

            var actual = await controller.Update(member.Id.Value, member);

            Assert.Same(member, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var memberId = Guid.NewGuid();

            var service = new Mock<IMemberService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteMember(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == memberId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new MembersController(service.Object, authService.Object);

            var actual = await controller.Delete(memberId);

            Assert.Equal(memberId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}