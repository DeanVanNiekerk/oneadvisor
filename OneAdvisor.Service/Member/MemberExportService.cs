using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Model.Lookup;
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

        public async Task Export(IExportRenderer<ExportMember> renderer, Stream stream, ExportMemberQueryOptions options)
        {
            var query = from member in ScopeQuery.GetMemberEntityQuery(_context, options.Scope)
                        select new ExportMember()
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