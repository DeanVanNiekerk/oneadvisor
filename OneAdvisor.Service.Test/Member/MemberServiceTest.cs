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

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "B Org 2" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id, Name = "Branch 2" };

            var user1 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch2.Id };

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
                UserId = user1.Id
            };

            var member2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                UserId = user2.Id
            };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);

                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.User.Add(user1);
                context.User.Add(user2);

                context.Member.Add(member1);
                context.Member.Add(member2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var queryOptions = new MemberQueryOptions(new Scope(), "", "", 0, 0);
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

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "B Org 2" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 2" };
            var branch3 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id, Name = "Branch 3" };

            var user1 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch2.Id };
            var user3 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch3.Id };

            //Given
            var member1 = new MemberEntity { Id = Guid.NewGuid(), UserId = user1.Id };
            var member2 = new MemberEntity { Id = Guid.NewGuid(), UserId = user2.Id };
            var member3 = new MemberEntity { Id = Guid.NewGuid(), UserId = user3.Id };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);
                context.Organisation.Add(org2);

                context.Branch.Add(branch1);
                context.Branch.Add(branch2);
                context.Branch.Add(branch3);

                context.User.Add(user1);
                context.User.Add(user2);
                context.User.Add(user3);

                context.Member.Add(member1);
                context.Member.Add(member2);
                context.Member.Add(member3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = new Scope()
                {
                    OrganisationId = org1.Id
                };
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
        public async Task GetMembers_BranchLevel()
        {
            var options = TestHelper.GetDbContext("GetMembers_BranchLevel");

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 2" };

            var user1 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user3 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch2.Id };

            //Given
            var member1 = new MemberEntity { Id = Guid.NewGuid(), UserId = user1.Id };
            var member2 = new MemberEntity { Id = Guid.NewGuid(), UserId = user2.Id };
            var member3 = new MemberEntity { Id = Guid.NewGuid(), UserId = user3.Id };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);

                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.User.Add(user1);
                context.User.Add(user2);
                context.User.Add(user3);

                context.Member.Add(member1);
                context.Member.Add(member2);
                context.Member.Add(member3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = new Scope()
                {
                    BranchId = branch1.Id
                };
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
        public async Task GetMembers_UserLevel()
        {
            var options = TestHelper.GetDbContext("GetMembers_UserLevel");

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };

            var user1 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };

            //Given
            var member1 = new MemberEntity { Id = Guid.NewGuid(), UserId = user1.Id };
            var member2 = new MemberEntity { Id = Guid.NewGuid(), UserId = user2.Id };
            var member3 = new MemberEntity { Id = Guid.NewGuid(), UserId = user1.Id };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);

                context.Branch.Add(branch1);

                context.User.Add(user1);
                context.User.Add(user2);

                context.Member.Add(member1);
                context.Member.Add(member2);
                context.Member.Add(member3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = new Scope()
                {
                    UserId = user1.Id
                };
                var queryOptions = new MemberQueryOptions(scope, "", "", 0, 0);
                var members = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(2, members.TotalItems);
                Assert.AreEqual(2, members.Items.Count());

                var actual = members.Items.First();
                Assert.AreEqual(member1.Id, actual.Id);

                actual = members.Items.Last();
                Assert.AreEqual(member3.Id, actual.Id);
            }
        }


        [TestMethod]
        public async Task GetMembers_SortAndPage()
        {
            var options = TestHelper.GetDbContext("GetMembers_SortAndPage");

            //Given
            var user1 = TestHelper.InsertDefaultUser(options);

            var mem1 = new MemberEntity { Id = Guid.NewGuid(), LastName = "A Name 1", UserId = user1.Id };
            var mem2 = new MemberEntity { Id = Guid.NewGuid(), LastName = "B Name 2", UserId = user1.Id };
            var mem3 = new MemberEntity { Id = Guid.NewGuid(), LastName = "C Name 3", UserId = user1.Id };
            var mem4 = new MemberEntity { Id = Guid.NewGuid(), LastName = "D Name 4", UserId = user1.Id };
            var mem5 = new MemberEntity { Id = Guid.NewGuid(), LastName = "E Name 5", UserId = user1.Id };
            var mem6 = new MemberEntity { Id = Guid.NewGuid(), LastName = "F Name 6", UserId = user1.Id };

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
                var queryOptions = new MemberQueryOptions(new Scope(), "LastName", "asc", 2, 2);
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

            var user1 = TestHelper.InsertDefaultUser(options);
            var user2 = TestHelper.InsertDefaultUser(options);

            //Given
            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.Id
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
                UserId = user2.Id
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
                var actual = await service.GetMember(new Scope(), mem2.Id);

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
        public async Task GetMember_CheckScope()
        {
            var options = TestHelper.GetDbContext("GetMember_CheckScope");

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 2" };
            var branch3 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id, Name = "Branch 3" };

            var user1 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user3 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch2.Id };
            var user4 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch3.Id };

            //Given
            var member1 = new MemberEntity { Id = Guid.NewGuid(), UserId = user1.Id };
            var member2 = new MemberEntity { Id = Guid.NewGuid(), UserId = user2.Id };
            var member3 = new MemberEntity { Id = Guid.NewGuid(), UserId = user3.Id };
            var member4 = new MemberEntity { Id = Guid.NewGuid(), UserId = user4.Id };
            var member6 = new MemberEntity { Id = Guid.NewGuid(), UserId = user1.Id };

            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);

                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.User.Add(user1);
                context.User.Add(user2);
                context.User.Add(user3);

                context.Member.Add(member1);
                context.Member.Add(member2);
                context.Member.Add(member3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When

                //In scope (org 1 -> member 1)
                var scope = new Scope() { OrganisationId = org1.Id };
                var member = await service.GetMember(scope, member1.Id);
                Assert.AreEqual(member1.Id, member.Id);

                //In scope (org 1 -> member 3)
                scope = new Scope() { OrganisationId = org1.Id };
                member = await service.GetMember(scope, member3.Id);
                Assert.AreEqual(member3.Id, member.Id);

                //Out of scope (org 2 -> member 1)
                scope = new Scope() { OrganisationId = org2.Id };
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);

                //In scope (branch 1 -> member 1)
                scope = new Scope() { BranchId = branch1.Id };
                member = await service.GetMember(scope, member1.Id);
                Assert.AreEqual(member1.Id, member.Id);

                //In scope (branch 1 -> member 2)
                scope = new Scope() { BranchId = branch1.Id };
                member = await service.GetMember(scope, member2.Id);
                Assert.AreEqual(member2.Id, member.Id);

                //Out of scope (branch 2 -> member 1)
                scope = new Scope() { BranchId = branch2.Id };
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);

                //Out of scope (branch 3 -> member 1)
                scope = new Scope() { BranchId = branch3.Id };
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);

                //In scope (user 1 -> member 1)
                scope = new Scope() { UserId = user1.Id };
                member = await service.GetMember(scope, member1.Id);
                Assert.AreEqual(member1.Id, member.Id);

                //Out of scope (user 2 -> member 1)
                scope = new Scope() { UserId = user2.Id };
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);
            }
        }

        [TestMethod]
        public async Task InsertMember()
        {
            var options = TestHelper.GetDbContext("InsertMember");

            var user1 = TestHelper.InsertDefaultUser(options);

            //Given
            var member = new MemberEdit()
            {
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var result = await service.InsertMember(user1.Id, member);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FindAsync(((MemberEdit)result.Tag).Id);
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(user1.Id, actual.UserId);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
                Assert.AreEqual(member.DateOfBirth, actual.DateOfBirth);
            }
        }

        [TestMethod]
        public async Task UpdateMember()
        {
            var options = TestHelper.GetDbContext("UpdateMember");

            var user1 = TestHelper.InsertDefaultUser(options);
            var user2 = TestHelper.InsertDefaultUser(options);

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid(), FirstName = "FN 1", LastName = "LN 1", UserId = user1.Id };
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
                UserId = user2.Id
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
                IdNumber = "321654 updated",
                DateOfBirth = new DateTime(1983, 10, 3)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var result = await service.UpdateMember(user2.Id, member);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FindAsync(member.Id);
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(mem2.UserId, actual.UserId);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
                Assert.AreEqual(member.DateOfBirth, actual.DateOfBirth);
            }
        }

        [TestMethod]
        public async Task GetMembers_Filter()
        {
            var options = TestHelper.GetDbContext("GetMembers_Filter");

            //Given
            var user1 = TestHelper.InsertDefaultUser(options);
            var member1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "van Niekerk",
                UserId = user1.Id
            };

            var member2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "Jones",
                UserId = user1.Id
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
                var queryOptions = new MemberQueryOptions(new Scope(), "", "", 0, 0, "lastName=nie");
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