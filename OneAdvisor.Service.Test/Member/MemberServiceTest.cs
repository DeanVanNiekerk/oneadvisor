using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{
    [TestClass]
    public class MemberServiceTest
    {

        [TestMethod]
        public async Task GetMembers()
        {
            var options = TestHelper.GetDbContext("GetMembers");

            var orgId1 = Guid.NewGuid();

            //Given
            var member1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = orgId1
            };

            var member2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = orgId1
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(member1);
                context.Member.Add(member2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new MemberQueryOptions(scope, "", "", 0, 0);
                var members = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(2, members.TotalItems);
                Assert.AreEqual(2, members.Items.Count());

                var actual = members.Items.First();
                Assert.AreEqual(member1.Id, actual.Id);
                Assert.AreEqual(member1.FirstName, actual.FirstName);
                Assert.AreEqual(member1.LastName, actual.LastName);
                Assert.AreEqual(member1.MaidenName, actual.MaidenName);
                Assert.AreEqual(member1.Initials, actual.Initials);
                Assert.AreEqual(member1.PreferredName, actual.PreferredName);
                Assert.AreEqual(member1.IdNumber, actual.IdNumber);
                Assert.AreEqual(member1.DateOfBirth, actual.DateOfBirth);
            }
        }


        [TestMethod]
        public async Task GetMembers_OrganisationLevel()
        {
            var options = TestHelper.GetDbContext("GetMembers_OrganisationLevel");

            var orgId1 = Guid.NewGuid();
            var orgId2 = Guid.NewGuid();

            //Given
            var member1 = new MemberEntity { Id = Guid.NewGuid(), OrganisationId = orgId1 };
            var member2 = new MemberEntity { Id = Guid.NewGuid(), OrganisationId = orgId1 };
            var member3 = new MemberEntity { Id = Guid.NewGuid(), OrganisationId = orgId2 };

            using (var context = new DataContext(options))
            {
                context.Member.Add(member1);
                context.Member.Add(member2);
                context.Member.Add(member3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new MemberQueryOptions(scope, "", "", 0, 0);
                var members = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(2, members.TotalItems);
                Assert.AreEqual(2, members.Items.Count());

                var actual = members.Items.First();
                Assert.AreEqual(member1.Id, actual.Id);

                actual = members.Items.Last();
                Assert.AreEqual(member2.Id, actual.Id);
            }
        }



        [TestMethod]
        public async Task GetMembers_SortAndPage()
        {
            var options = TestHelper.GetDbContext("GetMembers_SortAndPage");

            //Given
            var orgId1 = Guid.NewGuid();

            var mem1 = new MemberEntity { Id = Guid.NewGuid(), LastName = "A Name 1", OrganisationId = orgId1 };
            var mem2 = new MemberEntity { Id = Guid.NewGuid(), LastName = "B Name 2", OrganisationId = orgId1 };
            var mem3 = new MemberEntity { Id = Guid.NewGuid(), LastName = "C Name 3", OrganisationId = orgId1 };
            var mem4 = new MemberEntity { Id = Guid.NewGuid(), LastName = "D Name 4", OrganisationId = orgId1 };
            var mem5 = new MemberEntity { Id = Guid.NewGuid(), LastName = "E Name 5", OrganisationId = orgId1 };
            var mem6 = new MemberEntity { Id = Guid.NewGuid(), LastName = "F Name 6", OrganisationId = orgId1 };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.Member.Add(mem1);
                context.Member.Add(mem2);
                context.Member.Add(mem6);
                context.Member.Add(mem4);
                context.Member.Add(mem5);
                context.Member.Add(mem3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new MemberQueryOptions(scope, "LastName", "asc", 2, 2);
                var actual = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(6, actual.TotalItems);

                var members = actual.Items.ToArray();

                Assert.AreEqual(2, members.Count());

                var actual1 = members[0];
                Assert.AreEqual(mem4.Id, actual1.Id);

                var actual2 = members[1];
                Assert.AreEqual(mem3.Id, actual2.Id);
            }
        }


        [TestMethod]
        public async Task GetMember()
        {
            var options = TestHelper.GetDbContext("GetMember");

            var orgId1 = Guid.NewGuid();

            //Given
            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = orgId1
            };

            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = orgId1
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);
                context.Member.Add(mem2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var actual = await service.GetMember(scope, mem2.Id);

                //Then
                Assert.AreEqual(mem2.Id, actual.Id);
                Assert.AreEqual(mem2.FirstName, actual.FirstName);
                Assert.AreEqual(mem2.LastName, actual.LastName);
                Assert.AreEqual(mem2.MaidenName, actual.MaidenName);
                Assert.AreEqual(mem2.Initials, actual.Initials);
                Assert.AreEqual(mem2.PreferredName, actual.PreferredName);
                Assert.AreEqual(mem2.IdNumber, actual.IdNumber);
                Assert.AreEqual(mem2.DateOfBirth, actual.DateOfBirth);
            }
        }


        [TestMethod]
        public async Task GetMemberPreview()
        {
            var options = TestHelper.GetDbContext("GetMemberPreview");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = user1.Organisation.Id
            };

            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user1.Organisation.Id
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                MemberId = mem2.Id,
                UserId = user1.User.Id
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                MemberId = mem2.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);
                context.Member.Add(mem2);

                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetMemberPreview(scopeOptions, mem2.Id);

                //Then
                Assert.AreEqual(mem2.Id, actual.Id);
                Assert.AreEqual(mem2.FirstName, actual.FirstName);
                Assert.AreEqual(mem2.LastName, actual.LastName);
                Assert.AreEqual(mem2.IdNumber, actual.IdNumber);
                Assert.AreEqual(mem2.DateOfBirth, actual.DateOfBirth);

                Assert.AreEqual(2, actual.PolicyCount);
            }
        }

        [TestMethod]
        public async Task InsertMember()
        {
            var options = TestHelper.GetDbContext("InsertMember");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var member = new MemberEdit()
            {
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.User);
                var result = await service.InsertMember(scope, member);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FindAsync(((MemberEdit)result.Tag).Id);
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(user1.Organisation.Id, actual.OrganisationId);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
                Assert.AreEqual(member.DateOfBirth, actual.DateOfBirth);
            }
        }

        public async Task UpdateMember()
        {
            var options = TestHelper.GetDbContext("UpdateMember");

            var orgId1 = Guid.NewGuid();
            var orgId2 = Guid.NewGuid();

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid(), FirstName = "FN 1", LastName = "LN 1", OrganisationId = orgId1 };
            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = orgId2
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);
                context.Member.Add(mem2);

                context.SaveChanges();
            }

            var member = new MemberEdit()
            {
                Id = mem2.Id,
                FirstName = "FN 1 updated",
                LastName = "LN 1 updated",
                MaidenName = "MN 1 updated",
                Initials = "INI 1 updated",
                PreferredName = "PN 1 updated",
                IdNumber = "8206090118089",
                DateOfBirth = new DateTime(1983, 10, 3)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var result = await service.UpdateMember(scope, member);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FindAsync(member.Id);
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(orgId2, actual.OrganisationId);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
                Assert.AreEqual(member.DateOfBirth, actual.DateOfBirth);

                //Scope check
                scope = TestHelper.GetScopeOptions(orgId2);
                result = await service.UpdateMember(scope, member);

                //Then
                Assert.IsFalse(result.Success);
            }
        }

        [TestMethod]
        public async Task GetMembers_Filter()
        {
            var options = TestHelper.GetDbContext("GetMembers_Filter");

            //Given
            var orgId1 = Guid.NewGuid();
            var member1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "van Niekerk",
                OrganisationId = orgId1
            };

            var member2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "Jones",
                OrganisationId = orgId1
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(member1);
                context.Member.Add(member2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new MemberQueryOptions(scope, "", "", 0, 0, "lastName=%nie%");
                var members = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(2, members.TotalItems);
                Assert.AreEqual(1, members.Items.Count());

                var actual = members.Items.First();
                Assert.AreEqual(member1.Id, actual.Id);
            }
        }

    }
}