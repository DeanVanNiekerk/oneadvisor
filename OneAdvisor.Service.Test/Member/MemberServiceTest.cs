using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
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

            //Given
            var member = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654"
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(member);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var queryOptions = new MemberQueryOptions("", "", 0, 0);
                var members = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(members.TotalItems, 1);
                Assert.AreEqual(members.Items.Count(), 1);

                var actual = members.Items.First();
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
            }
        }

        [TestMethod]
        public async Task GetMembers_SortAndPage()
        {
            var options = TestHelper.GetDbContext("GetMembers_SortAndPage");

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid(), LastName = "A Name 1" };
            var mem2 = new MemberEntity { Id = Guid.NewGuid(), LastName = "B Name 2" };
            var mem3 = new MemberEntity { Id = Guid.NewGuid(), LastName = "C Name 3" };
            var mem4 = new MemberEntity { Id = Guid.NewGuid(), LastName = "D Name 4" };
            var mem5 = new MemberEntity { Id = Guid.NewGuid(), LastName = "E Name 5" };
            var mem6 = new MemberEntity { Id = Guid.NewGuid(), LastName = "F Name 6" };

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
                var queryOptions = new MemberQueryOptions("LastName", "asc", 2, 2);
                var actual = await service.GetMembers(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 6);

                var members = actual.Items.ToArray();

                Assert.AreEqual(members.Count(), 2);

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

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid() };
            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654"
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
                var actual = await service.GetMember(mem2.Id);

                //Then
                Assert.AreEqual(mem2.Id, actual.Id);
                Assert.AreEqual(mem2.FirstName, actual.FirstName);
                Assert.AreEqual(mem2.LastName, actual.LastName);
                Assert.AreEqual(mem2.MaidenName, actual.MaidenName);
                Assert.AreEqual(mem2.Initials, actual.Initials);
                Assert.AreEqual(mem2.PreferredName, actual.PreferredName);
                Assert.AreEqual(mem2.IdNumber, actual.IdNumber);
            }
        }

        [TestMethod]
        public async Task InsertMember()
        {
            var options = TestHelper.GetDbContext("InsertMember");

            //Given
            var member = new MemberEdit()
            {
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654"
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var result = await service.InsertMember(member);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FindAsync(((MemberEdit)result.Tag).Id);
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
            }
        }

        [TestMethod]
        public async Task UpdateMember()
        {
            var options = TestHelper.GetDbContext("UpdateMember");

            //Given
            var mem1 = new MemberEntity { Id = Guid.NewGuid(), FirstName = "FN 1", LastName = "LN 1" };
            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654"
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
                IdNumber = "321654 updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberService(context);

                //When
                var result = await service.UpdateMember(member);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FindAsync(member.Id);
                Assert.AreEqual(member.Id, actual.Id);
                Assert.AreEqual(member.FirstName, actual.FirstName);
                Assert.AreEqual(member.LastName, actual.LastName);
                Assert.AreEqual(member.MaidenName, actual.MaidenName);
                Assert.AreEqual(member.Initials, actual.Initials);
                Assert.AreEqual(member.PreferredName, actual.PreferredName);
                Assert.AreEqual(member.IdNumber, actual.IdNumber);
            }
        }

    }
}