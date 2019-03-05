using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.Members;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;

namespace api.Test.Controllers.Member
{
    [TestClass]
    public class MembersControllerTest
    {
        [TestMethod]
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

            var actual = await controller.Index("firstName", "desc", 15, 2, "lastName=%van%");

            Assert.AreEqual(Scope.Branch, queryOptions.Scope.Scope);
            Assert.AreEqual("firstName", queryOptions.SortOptions.Column);
            Assert.AreEqual(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.AreEqual(15, queryOptions.PageOptions.Size);
            Assert.AreEqual(2, queryOptions.PageOptions.Number);

            Assert.AreEqual("%van%", queryOptions.LastName);

            Assert.AreEqual("{\"TotalItems\":1,\"Items\":[{\"Id\":\"21f9f54f-0bbc-4afc-a588-b6bae4f47ae6\",\"FirstName\":\"1\",\"LastName\":\"2\",\"MaidenName\":\"5\",\"Initials\":\"4\",\"PreferredName\":\"7\",\"IdNumber\":\"3\",\"DateOfBirth\":\"1982-10-03T00:00:00\",\"PassportNumber\":\"6\",\"TaxNumber\":\"8\",\"MarritalStatusId\":\"ffa2421d-f77f-4957-bdc5-2e79f7537d22\",\"MarriageDate\":\"2010-03-25T00:00:00\"}]}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
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

            var actual = await controller.Get(member.Id.Value);

            Assert.AreEqual("{\"Result\":{\"Value\":{\"Id\":\"21f9f54f-0bbc-4afc-a588-b6bae4f47ae6\",\"FirstName\":\"1\",\"LastName\":\"2\",\"MaidenName\":\"5\",\"Initials\":\"4\",\"PreferredName\":\"7\",\"IdNumber\":\"3\",\"DateOfBirth\":\"1982-10-03T00:00:00\",\"PassportNumber\":\"6\",\"TaxNumber\":\"8\",\"MarritalStatusId\":\"ffa2421d-f77f-4957-bdc5-2e79f7537d22\",\"MarriageDate\":\"2010-03-25T00:00:00\"},\"Formatters\":[],\"ContentTypes\":[],\"DeclaredType\":null,\"StatusCode\":200},\"Value\":null}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
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

            var actual = await controller.GetPreview(member.Id);

            Assert.AreEqual("{\"Result\":null,\"Value\":{\"Id\":\"21f9f54f-0bbc-4afc-a588-b6bae4f47ae6\",\"FirstName\":\"1\",\"LastName\":\"2\",\"IdNumber\":\"3\",\"DateOfBirth\":\"1982-10-03T00:00:00\",\"PolicyCount\":5,\"ContactCount\":4}}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
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

            Assert.AreSame(member, inserted);
            Assert.AreEqual(Scope.Branch, options.Scope);

            Assert.AreEqual("{\"Result\":{\"Value\":{\"Success\":true,\"Tag\":null,\"Errors\":[],\"ValidationFailures\":[]},\"Formatters\":[],\"ContentTypes\":[],\"DeclaredType\":null,\"StatusCode\":200},\"Value\":null}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
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

            Assert.AreSame(member, updated);
            Assert.AreEqual(Scope.Branch, options.Scope);

            Assert.AreEqual("{\"Result\":{\"Value\":{\"Success\":true,\"Tag\":null,\"Errors\":[],\"ValidationFailures\":[]},\"Formatters\":[],\"ContentTypes\":[],\"DeclaredType\":null,\"StatusCode\":200},\"Value\":null}", JsonConvert.SerializeObject(actual));
        }
    }
}