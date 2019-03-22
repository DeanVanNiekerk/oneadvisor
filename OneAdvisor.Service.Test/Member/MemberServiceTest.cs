using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Member;
using OneAdvisor.Model.Member.Model.Merge;

namespace OneAdvisor.Service.Test.Member
{

    public class MemberServiceTest
    {

        [Fact]
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
                OrganisationId = orgId1,
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13),
            };

            var member2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = orgId1
            };

            var member3 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                IsDeleted = true,
                OrganisationId = orgId1
            };

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
                Assert.Equal(2, members.TotalItems);
                Assert.Equal(2, members.Items.Count());

                var actual = members.Items.First();
                Assert.Equal(member1.Id, actual.Id);
                Assert.Equal(member1.FirstName, actual.FirstName);
                Assert.Equal(member1.LastName, actual.LastName);
                Assert.Equal(member1.MaidenName, actual.MaidenName);
                Assert.Equal(member1.Initials, actual.Initials);
                Assert.Equal(member1.PreferredName, actual.PreferredName);
                Assert.Equal(member1.IdNumber, actual.IdNumber);
                Assert.Equal(member1.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member1.TaxNumber, actual.TaxNumber);
                Assert.Equal(member1.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(member1.MarriageDate, actual.MarriageDate);
            }
        }


        [Fact]
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
                Assert.Equal(2, members.TotalItems);
                Assert.Equal(2, members.Items.Count());

                var actual = members.Items.First();
                Assert.Equal(member1.Id, actual.Id);

                actual = members.Items.Last();
                Assert.Equal(member2.Id, actual.Id);
            }
        }



        [Fact]
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
                var queryOptions = new MemberQueryOptions(scope, "LastName", "desc", 2, 2);
                var actual = await service.GetMembers(queryOptions);

                //Then
                Assert.Equal(6, actual.TotalItems);

                var members = actual.Items.ToArray();

                Assert.Equal(2, members.Count());

                var actual1 = members[0];
                Assert.Equal(mem4.Id, actual1.Id);

                var actual2 = members[1];
                Assert.Equal(mem3.Id, actual2.Id);
            }
        }


        [Fact]
        public async Task GetMember()
        {
            var options = TestHelper.GetDbContext("GetMember");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

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
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user2.Organisation.Id,
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13)
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
                var scope = TestHelper.GetScopeOptions(user2);
                var actual = await service.GetMember(scope, mem2.Id);

                //Then
                Assert.Equal(mem2.Id, actual.Id);
                Assert.Equal(mem2.FirstName, actual.FirstName);
                Assert.Equal(mem2.LastName, actual.LastName);
                Assert.Equal(mem2.MaidenName, actual.MaidenName);
                Assert.Equal(mem2.Initials, actual.Initials);
                Assert.Equal(mem2.PreferredName, actual.PreferredName);
                Assert.Equal(mem2.IdNumber, actual.IdNumber);
                Assert.Equal(mem2.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(mem2.TaxNumber, actual.TaxNumber);
                Assert.Equal(mem2.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(mem2.MarriageDate, actual.MarriageDate);

                //Scope check
                scope = TestHelper.GetScopeOptions(user1);
                actual = await service.GetMember(scope, mem2.Id);

                Assert.Null(actual);
            }
        }


        [Fact]
        public async Task GetMemberPreview()
        {
            var options = TestHelper.GetDbContext("GetMemberPreview");

            var user1 = TestHelper.InsertUserDetailed(options);

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

            var contact1 = new ContactEntity
            {
                Id = Guid.NewGuid(),
                MemberId = mem2.Id,
                ContactTypeId = ContactType.CONTACT_TYPE_EMAIL,
                Value = "dean@email.com"
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);
                context.Member.Add(mem2);

                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.Contact.Add(contact1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetMemberPreview(scopeOptions, mem2.Id);

                //Then
                Assert.Equal(mem2.Id, actual.Id);
                Assert.Equal(mem2.FirstName, actual.FirstName);
                Assert.Equal(mem2.LastName, actual.LastName);
                Assert.Equal(mem2.IdNumber, actual.IdNumber);
                Assert.Equal(mem2.DateOfBirth, actual.DateOfBirth);

                Assert.Equal(2, actual.PolicyCount);
                Assert.Equal(1, actual.ContactCount);
            }
        }

        [Fact]
        public async Task InsertMember()
        {
            var options = TestHelper.GetDbContext("InsertMember");

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var member = new MemberEdit()
            {
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.User);
                var result = await service.InsertMember(scope, member);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FindAsync(((MemberEdit)result.Tag).Id);
                Assert.Equal(member.Id, actual.Id);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(member.FirstName, actual.FirstName);
                Assert.Equal(member.LastName, actual.LastName);
                Assert.Equal(member.MaidenName, actual.MaidenName);
                Assert.Equal(member.Initials, actual.Initials);
                Assert.Equal(member.PreferredName, actual.PreferredName);
                Assert.Equal(member.IdNumber, actual.IdNumber);
                Assert.Equal(member.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member.TaxNumber, actual.TaxNumber);
                Assert.Equal(member.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(member.MarriageDate, actual.MarriageDate);
            }
        }

        [Fact]
        public async Task UpdateMember()
        {
            var options = TestHelper.GetDbContext("UpdateMember");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid(), FirstName = "FN 1", LastName = "LN 1", OrganisationId = user1.Organisation.Id };
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
                OrganisationId = user2.Organisation.Id,
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13)
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
                DateOfBirth = new DateTime(1983, 10, 3),
                TaxNumber = "445566",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2010, 11, 13)
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user2);
                var result = await service.UpdateMember(scope, member);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FindAsync(member.Id);
                Assert.Equal(member.Id, actual.Id);
                Assert.Equal(user2.Organisation.Id, actual.OrganisationId);
                Assert.Equal(member.FirstName, actual.FirstName);
                Assert.Equal(member.LastName, actual.LastName);
                Assert.Equal(member.MaidenName, actual.MaidenName);
                Assert.Equal(member.Initials, actual.Initials);
                Assert.Equal(member.PreferredName, actual.PreferredName);
                Assert.Equal(member.IdNumber, actual.IdNumber);
                Assert.Equal(member.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member.TaxNumber, actual.TaxNumber);
                Assert.Equal(member.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(member.MarriageDate, actual.MarriageDate);

                //Scope check
                scope = TestHelper.GetScopeOptions(user1);
                result = await service.UpdateMember(scope, member);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task DeleteMember()
        {
            var options = TestHelper.GetDbContext("DeleteMember");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);
            var member2 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.DeleteMember(scope, member1.Member.Id);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FindAsync(member1.Member.Id);
                Assert.True(actual.IsDeleted);

                var member = await service.GetMember(scope, member1.Member.Id);
                Assert.Null(member);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                result = await service.DeleteMember(scope, member2.Member.Id);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
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
                Assert.Equal(1, members.TotalItems);
                Assert.Single(members.Items);

                var actual = members.Items.First();
                Assert.Equal(member1.Id, actual.Id);
            }
        }

        [Fact]
        public async Task MergeMembers()
        {
            var options = TestHelper.GetDbContext("MergeMembers");

            //Given
            var user = TestHelper.InsertUserDetailed(options);

            var memberSource1 = TestHelper.InsertMember(options, user.Organisation, "8210035032082");
            var memberSource2 = TestHelper.InsertMember(options, user.Organisation);
            var member3 = TestHelper.InsertMember(options, user.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);
            var member4 = TestHelper.InsertMember(options, user2.Organisation, "8210035032082"); //Same Id but different organisation

            var target = new MemberEdit
            {
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13),
            };

            using (var context = new DataContext(options))
            {
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                var merge = new MergeMembers()
                {
                    TargetMember = target,
                    SourceMemberIds = new List<Guid>() { memberSource1.Member.Id, memberSource2.Member.Id }
                };

                //When
                var scope = TestHelper.GetScopeOptions(user.Organisation.Id);
                var result = await service.MergeMembers(scope, merge);

                //Then
                Assert.True(result.Success);

                //Check new member added
                var memberId = ((MemberEdit)result.Tag).Id;
                var actual = context.Member.Find(memberId);
                Assert.Equal(target.FirstName, actual.FirstName);
                Assert.Equal(target.LastName, actual.LastName);
                Assert.Equal(target.MaidenName, actual.MaidenName);
                Assert.Equal(target.Initials, actual.Initials);
                Assert.Equal(target.PreferredName, actual.PreferredName);
                Assert.Equal(target.IdNumber, actual.IdNumber);
                Assert.Equal(target.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(target.TaxNumber, actual.TaxNumber);
                Assert.Equal(target.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(target.MarriageDate, actual.MarriageDate);
                Assert.False(actual.IsDeleted);

                //Check old members deleted
                actual = context.Member.Find(memberSource1.Member.Id);
                Assert.True(actual.IsDeleted);
                actual = context.Member.Find(memberSource2.Member.Id);
                Assert.True(actual.IsDeleted);

                //Dummy un-effected
                actual = context.Member.Find(member3.Member.Id);
                Assert.False(actual.IsDeleted);

                //Different Organisation un-effected
                actual = context.Member.Find(member4.Member.Id);
                Assert.False(actual.IsDeleted);
            }
        }

        [Fact]
        public async Task MergeMembers_ScopeCheck()
        {
            var options = TestHelper.GetDbContext("MergeMembers_ScopeCheck");

            //Given
            var user = TestHelper.InsertUserDetailed(options);

            var memberSource1 = TestHelper.InsertMember(options, user.Organisation, "8210035032082");
            var memberSource2 = TestHelper.InsertMember(options, user.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var target = new MemberEdit
            {
                IdNumber = "8210035032082"
            };

            using (var context = new DataContext(options))
            {
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                var merge = new MergeMembers()
                {
                    TargetMember = target,
                    SourceMemberIds = new List<Guid>() { memberSource1.Member.Id, memberSource2.Member.Id }
                };

                //When
                var scope = TestHelper.GetScopeOptions(user2.Organisation.Id);
                var result = await service.MergeMembers(scope, merge);

                //Then
                Assert.False(result.Success);
                Assert.Equal("SourceMemberIds", result.ValidationFailures[0].PropertyName);
                Assert.Equal("Invalid Source Member Ids", result.ValidationFailures[0].ErrorMessage);
            }
        }

    }
}