using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Service.Member;
using OneAdvisor.Service.Directory;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Service.Test.Commission
{
    [TestClass]
    public class ImportCommissionServiceTest
    {

        [TestMethod]
        public async Task ImportCommission_Insert()
        {
            var options = TestHelper.GetDbContext("ImportCommission_Insert");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var commissionType = TestHelper.InsertDefaultCommissionType(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var commissionService = new CommissionService(context);
                var policyService = new PolicyService(context);
                var lookupService = new LookupService(context);
                var service = new CommissionImportService(context, commissionService, policyService, lookupService);

                //When
                var data = new ImportCommission()
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = 99,
                    VAT = 14,
                    Date = DateTime.Now.AddDays(-10)
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportCommission(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Commission.FirstOrDefaultAsync(p => p.PolicyId == policy1.Id);
                Assert.AreEqual(commissionType.Id, actual.CommissionTypeId);
                Assert.AreEqual(data.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(data.VAT, actual.VAT);
                Assert.AreEqual(data.Date, actual.Date);
            }
        }
    }
}