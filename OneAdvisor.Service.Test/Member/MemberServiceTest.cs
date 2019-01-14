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

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "A Org 1" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 2" };

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
                var scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
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
                var scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
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
                var scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
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
                var scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.User);
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
            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            var mem1 = new MemberEntity { Id = Guid.NewGuid(), LastName = "A Name 1", UserId = user1.User.Id };
            var mem2 = new MemberEntity { Id = Guid.NewGuid(), LastName = "B Name 2", UserId = user1.User.Id };
            var mem3 = new MemberEntity { Id = Guid.NewGuid(), LastName = "C Name 3", UserId = user1.User.Id };
            var mem4 = new MemberEntity { Id = Guid.NewGuid(), LastName = "D Name 4", UserId = user1.User.Id };
            var mem5 = new MemberEntity { Id = Guid.NewGuid(), LastName = "E Name 5", UserId = user1.User.Id };
            var mem6 = new MemberEntity { Id = Guid.NewGuid(), LastName = "F Name 6", UserId = user1.User.Id };

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
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new MemberQueryOptions(scopeOptions, "LastName", "asc", 2, 2);
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

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id
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
                UserId = user2.User.Id
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
                var scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                var actual = await service.GetMember(scopeOptions, mem2.Id);

                //Then
                Assert.AreEqual(mem2.Id, actual.Id);
                Assert.AreEqual(mem2.UserId, actual.UserId);
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
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id
            };

            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                UserId = user2.User.Id
            };

            var policy1 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                MemberId = mem2.Id
            };

            var policy2 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                MemberId = mem2.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);
                context.Member.Add(mem2);

                context.MemberPolicy.Add(policy1);
                context.MemberPolicy.Add(policy2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                var actual = await service.GetMemberPreview(scopeOptions, mem2.Id);

                //Then
                Assert.AreEqual(mem2.Id, actual.Id);
                Assert.AreEqual(mem2.UserId, actual.UserId);
                Assert.AreEqual(mem2.FirstName, actual.FirstName);
                Assert.AreEqual(mem2.LastName, actual.LastName);
                Assert.AreEqual(mem2.IdNumber, actual.IdNumber);
                Assert.AreEqual(mem2.DateOfBirth, actual.DateOfBirth);

                Assert.AreEqual(user2.User.FirstName, actual.UserFirstName);
                Assert.AreEqual(user2.User.LastName, actual.UserLastName);

                Assert.AreEqual(2, actual.PolicyCount);
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
                var scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
                var member = await service.GetMember(scope, member1.Id);
                Assert.AreEqual(member1.Id, member.Id);

                //In scope (org 1 -> member 3)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
                member = await service.GetMember(scope, member3.Id);
                Assert.AreEqual(member3.Id, member.Id);

                //Out of scope (org 2 -> member 1)
                scope = new ScopeOptions(org2.Id, branch3.Id, user4.Id, Scope.Organisation);
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);

                //In scope (branch 1 -> member 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
                member = await service.GetMember(scope, member1.Id);
                Assert.AreEqual(member1.Id, member.Id);

                //In scope (branch 1 -> member 2)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
                member = await service.GetMember(scope, member2.Id);
                Assert.AreEqual(member2.Id, member.Id);

                //Out of scope (branch 2 -> member 1)
                scope = new ScopeOptions(org1.Id, branch2.Id, user3.Id, Scope.Branch);
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);

                //Out of scope (branch 3 -> member 1)
                scope = new ScopeOptions(org2.Id, branch3.Id, user4.Id, Scope.Branch);
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);

                //In scope (user 1 -> member 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.User);
                member = await service.GetMember(scope, member1.Id);
                Assert.AreEqual(member1.Id, member.Id);

                //Out of scope (user 2 -> member 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user2.Id, Scope.User);
                member = await service.GetMember(scope, member1.Id);
                Assert.IsNull(member);
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
                UserId = user1.User.Id,
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
                Assert.AreEqual(user1.User.Id, actual.UserId);
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
        public async Task InsertMember_UserIdNotInScope()
        {
            var options = TestHelper.GetDbContext("InsertMember_UserIdNotInScope");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            //Given
            var member = new MemberEdit()
            {
                FirstName = "FN 1",
                LastName = "LN 1",
                UserId = user2.User.Id,
                IdNumber = "8210035032082",
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.User);
                var result = await service.InsertMember(scope, member);

                //Then
                Assert.IsFalse(result.Success);

                var error = result.ValidationFailures.Single();
                Assert.AreEqual("User exists but is out of scope", error.ErrorMessage);
            }
        }

        public async Task UpdateMember()
        {
            var options = TestHelper.GetDbContext("UpdateMember");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid(), FirstName = "FN 1", LastName = "LN 1", UserId = user1.User.Id };
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
                UserId = user2.User.Id
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
                UserId = user2.User.Id,
                DateOfBirth = new DateTime(1983, 10, 3)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user2, Scope.User);
                var result = await service.UpdateMember(scope, member);

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

                //Scope check
                scope = TestHelper.GetScopeOptions(user1, Scope.User);
                result = await service.UpdateMember(scope, member);

                //Then
                Assert.IsFalse(result.Success);
            }
        }

        [TestMethod]
        public async Task UpdateMember_UserIdNotInScope()
        {
            var options = TestHelper.GetDbContext("UpdateMember_UserIdNotInScope");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            //Given
            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                IdNumber = "8210035032082",
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);

                context.SaveChanges();
            }

            var member = new MemberEdit()
            {
                Id = mem1.Id,
                FirstName = "FN 1",
                LastName = "LN 1",
                IdNumber = "8206090118089",
                UserId = user2.User.Id
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.User);
                var result = await service.UpdateMember(scope, member);

                //Then
                Assert.IsFalse(result.Success);

                var error = result.ValidationFailures.Single();
                Assert.AreEqual("User exists but is out of scope", error.ErrorMessage);
            }
        }

        [TestMethod]
        public async Task GetMembers_Filter()
        {
            var options = TestHelper.GetDbContext("GetMembers_Filter");

            //Given
            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "van Niekerk",
                UserId = user1.User.Id
            };

            var member2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "Jones",
                UserId = user1.User.Id
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
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new MemberQueryOptions(scope, "", "", 0, 0, "lastName=nie");
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