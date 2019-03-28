using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.ExportMember;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Member
{
    public class MemberExportService : IMemberExportService
    {
        private readonly DataContext _context;

        public MemberExportService(DataContext context)
        {
            _context = context;
        }

        public async Task Policies(IExportRenderer<MemberPolicy> renderer, Stream stream, ScopeOptions scope)
        {
            var query = from member in ScopeQuery.GetMemberEntityQuery(_context, scope)
                        join policy in _context.Policy on member.Id equals policy.MemberId into policyGroup
                        from policy in policyGroup.DefaultIfEmpty()
                        join user in _context.Users on policy.UserId equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        select new MemberPolicy()
                        {
                            IdNumber = (member.IdNumber == "" || member.IdNumber == null) ? member.PassportNumber : member.IdNumber,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            Email = member.MemberContacts.Where(c => c.ContactTypeId == ContactType.CONTACT_TYPE_EMAIL).Select(c => c.Value).FirstOrDefault(),
                            CellPhone = member.MemberContacts.Where(c => c.ContactTypeId == ContactType.CONTACT_TYPE_CELLPHONE).Select(c => c.Value).FirstOrDefault(),
                            DateOfBirth = member.DateOfBirth,
                            TaxNumber = member.TaxNumber,
                            PolicyNumber = policy.Number,
                            PolicyBroker = user.FirstName + " " + user.LastName,
                            PolicyPremium = policy.Premium,
                            PolicyTypeCode = policy.PolicyType.Code,
                            PolicyStartDate = policy.StartDate,
                            PolicyCompany = policy.Company.Name
                        };

            var items = await query.ToListAsync();

            renderer.Render(stream, items);
        }

        public async Task PolicyAggregates(IExportRenderer<MemberPolicyAggregate> renderer, Stream stream, ScopeOptions scope)
        {
            var query = from member in ScopeQuery.GetMemberEntityQuery(_context, scope)
                        select new MemberPolicyAggregate()
                        {
                            IdNumber = member.IdNumber,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            Email = member.MemberContacts.Where(c => c.ContactTypeId == ContactType.CONTACT_TYPE_EMAIL).Select(c => c.Value).FirstOrDefault(),
                            PolicyInvestmentCount = member.MemberPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_INVESTMENT),
                            PolicyLifeInsuranceCount = member.MemberPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_LIFE_INSURANCE),
                            PolicyMedicalCoverCount = member.MemberPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_MEDICAL_COVER),
                            PolicyShortTermCount = member.MemberPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_SHORT_TERM),
                        };

            var items = await query.ToListAsync();

            renderer.Render(stream, items);
        }
    }
}