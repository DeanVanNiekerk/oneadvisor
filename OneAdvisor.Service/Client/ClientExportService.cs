using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.ExportClient;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Service.Client
{
    public class ClientExportService : IClientExportService
    {
        private readonly DataContext _context;

        public ClientExportService(DataContext context)
        {
            _context = context;
        }

        public async Task Policies(IExportRenderer<ClientPolicy> renderer, Stream stream, ScopeOptions scope)
        {
            var query = from client in ScopeQuery.GetClientEntityQuery(_context, scope)
                        join policy in _context.Policy on client.Id equals policy.ClientId into policyGroup
                        from policy in policyGroup.DefaultIfEmpty()
                        join user in _context.Users on policy.UserId equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        select new ClientPolicy()
                        {
                            IdNumber = client.IdNumber,
                            FirstName = client.FirstName,
                            LastName = client.LastName,
                            Email = client.ClientContacts.Where(c => c.ContactTypeId == ContactType.CONTACT_TYPE_EMAIL).Select(c => c.Value).FirstOrDefault(),
                            CellPhone = client.ClientContacts.Where(c => c.ContactTypeId == ContactType.CONTACT_TYPE_CELLPHONE).Select(c => c.Value).FirstOrDefault(),
                            DateOfBirth = client.DateOfBirth,
                            TaxNumber = client.TaxNumber,
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

        public async Task PolicyAggregates(IExportRenderer<ClientPolicyAggregate> renderer, Stream stream, ScopeOptions scope)
        {
            var query = from client in ScopeQuery.GetClientEntityQuery(_context, scope)
                        select new ClientPolicyAggregate()
                        {
                            IdNumber = client.IdNumber,
                            FirstName = client.FirstName,
                            LastName = client.LastName,
                            Email = client.ClientContacts.Where(c => c.ContactTypeId == ContactType.CONTACT_TYPE_EMAIL).Select(c => c.Value).FirstOrDefault(),
                            PolicyInvestmentCount = client.ClientPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_INVESTMENT),
                            PolicyLifeInsuranceCount = client.ClientPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_LIFE_INSURANCE),
                            PolicyMedicalCoverCount = client.ClientPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_MEDICAL_COVER),
                            PolicyShortTermCount = client.ClientPolicies.Count(p => p.PolicyTypeId == PolicyType.POLICY_TYPE_SHORT_TERM),
                        };

            var items = await query.ToListAsync();

            renderer.Render(stream, items);
        }
    }
}