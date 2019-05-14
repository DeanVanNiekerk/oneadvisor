using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Contact;
using OneAdvisor.Model.Client.Model.ImportClient;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Client.Validators;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Service.Client
{
    public class ClientImportService : IClientImportService
    {
        private readonly DataContext _context;
        private readonly IClientService _clientService;
        private readonly IPolicyService _policyService;
        private readonly IContactService _contactService;
        private readonly IClientLookupService _lookupService;

        public ClientImportService(DataContext context, IClientService clientService, IPolicyService policyService, IContactService contactService, IClientLookupService lookupService)
        {
            _context = context;
            _clientService = clientService;
            _policyService = policyService;
            _contactService = contactService;
            _lookupService = lookupService;
        }

        public async Task<Result> ImportClient(ScopeOptions scope, ImportClient data)
        {
            var validator = new ImportClientValidator(_context);
            var result = validator.Validate(data).GetResult();

            if (!result.Success)
                return result;

            //Clean id number
            data.IdNumber = CleanIdNumber(data.IdNumber);

            //Load date of birth from IdNumber if possible
            if (data.DateOfBirth == null)
            {
                var id = new IdNumber(data.IdNumber);
                if (id.IsValid)
                    data.DateOfBirth = id.DateOfBirth;
            }

            var userId = scope.UserId;

            //If a user is specified we, use it as the scope
            if (!string.IsNullOrEmpty(data.PolicyUserFullName))
            {
                var parts = data.PolicyUserFullName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);

                if (parts.Length != 2)
                {
                    result.AddValidationFailure("UserFullName", "Broker Full Name requires a First and Last Name only");
                    return result;
                }

                var userEntityQuery = ScopeQuery.GetUserEntityQuery(_context, scope);
                var users = await userEntityQuery.ToListAsync();

                var userQuery = from entity in users
                                where (String.Equals(entity.FirstName, parts[0], StringComparison.OrdinalIgnoreCase)
                                && String.Equals(entity.LastName, parts[1], StringComparison.OrdinalIgnoreCase))
                                //JSON Query: should be included in above query
                                || entity.Aliases.Any(alias => String.Equals(alias, data.PolicyUserFullName, StringComparison.OrdinalIgnoreCase))
                                select entity;

                var user = userQuery.FirstOrDefault();

                if (user == null)
                {
                    result.AddValidationFailure("UserFullName", "Broker does not exist or is out of scope");
                    return result;
                }

                userId = user.Id;
            }

            //Check if the client exists in the organisation
            var clients = await FindClient(scope, data);

            if (clients.Count >= 2)
            {
                result.AddValidationFailure("", "There are multiple clients matching this record, please increase specificity");
                return result;
            }

            var clientEntity = clients.FirstOrDefault();

            ClientEdit client = null;

            //Client exits, check client is in scope
            if (clientEntity != null)
            {
                client = await _clientService.GetClient(scope, clientEntity.Id);

                client = LoadClientIdNumber(client, data);

                client = MapClientProperties(client, data);

                result = await _clientService.UpdateClient(scope, client);

                if (!result.Success)
                    return result;
            }
            else
            {
                client = new ClientEdit();
                client = LoadClientIdNumber(client, data);
                client = MapClientProperties(client, data);
                client = LoadClientType(client, data);

                result = await _clientService.InsertClient(scope, client);

                if (!result.Success)
                    return result;

                client = (ClientEdit)result.Tag;
            }

            result = await ImportEmail(scope, data, client);

            if (!result.Success)
                return result;

            result = await ImportCellphone(scope, data, client);

            if (!result.Success)
                return result;

            result = await ImportPolicy(scope, data, client, userId);

            return result;
        }

        private string CleanIdNumber(string idNumber)
        {
            if (string.IsNullOrEmpty(idNumber))
                return idNumber;

            //Remove emtpty spaces
            idNumber = idNumber.Replace(" ", "");

            //Check if missing leading zero
            if (idNumber.Length == 12)
            {
                var id = new IdNumber($"0{idNumber}");
                if (id.IsValid) idNumber = id.IdentityNumber;
            }
            else if (idNumber.Length == 11)
            {
                var id = new IdNumber($"00{idNumber}");
                if (id.IsValid) idNumber = id.IdentityNumber;
            }
            else if (idNumber.Length == 10)
            {
                var id = new IdNumber($"000{idNumber}");
                if (id.IsValid) idNumber = id.IdentityNumber;
            }

            return idNumber;
        }

        private ClientEdit MapClientProperties(ClientEdit client, ImportClient data)
        {
            client.ClientTypeId = client.ClientTypeId.HasValue ? client.ClientTypeId : ClientType.CLIENT_TYPE_INDIVIDUAL;
            client.FirstName = data.FirstName != null ? data.FirstName : client.FirstName;
            client.LastName = data.LastName != null ? data.LastName : client.LastName;
            client.Initials = data.FirstName != null ? data.FirstName.Acronym() : client.Initials;
            client.TaxNumber = data.TaxNumber != null ? data.TaxNumber : client.TaxNumber;
            client.DateOfBirth = data.DateOfBirth != null ? data.DateOfBirth : client.DateOfBirth;

            return client;
        }

        private ClientEdit LoadClientType(ClientEdit client, ImportClient data)
        {
            //If there is no id number but there is a policy number then set client type to Unknown.
            if (string.IsNullOrWhiteSpace(data.IdNumber) && !string.IsNullOrWhiteSpace(data.PolicyNumber))
                client.ClientTypeId = ClientType.CLIENT_TYPE_UNKNOWN_ENTITY;

            return client;
        }

        private ClientEdit LoadClientIdNumber(ClientEdit client, ImportClient data)
        {
            if (string.IsNullOrWhiteSpace(data.IdNumber))
                return client;

            var id = new IdNumber(data.IdNumber);
            if (id.IsValid)
                client.IdNumber = data.IdNumber;
            else
                client.AlternateIdNumber = data.IdNumber;

            return client;
        }

        private async Task<List<ClientEntity>> FindClient(ScopeOptions scope, ImportClient data)
        {
            //Check if the client exists in the organisation
            var clientQuery = ScopeQuery.GetClientEntityQuery(_context, scope);

            IQueryable<ClientEntity> query;

            if (!string.IsNullOrWhiteSpace(data.IdNumber))
            {
                //First try and match on IdNumber and AlternateIdNumber
                query = from entity in clientQuery
                        where entity.IdNumber == data.IdNumber
                        || entity.AlternateIdNumber == data.IdNumber
                        select entity;

                var matches = await query.ToListAsync();

                if (matches.Any())
                    return matches;

                //If no match try with first 10 chars of Id number
                if (data.IdNumber.Count() >= 10)
                {
                    query = from entity in clientQuery
                            where EF.Functions.Like(entity.IdNumber, $"{data.IdNumber.Substring(0, 10)}%")
                            select entity;

                    matches = await query.ToListAsync();

                    if (matches.Any())
                        return matches;
                }
            }
            //If we dont have an Id then try match on the PolicyNumber
            else if (!string.IsNullOrWhiteSpace(data.PolicyNumber))
            {
                var policy = await _policyService.GetPolicy(scope, data.PolicyCompanyId.Value, data.PolicyNumber);
                if (policy != null)
                {
                    query = from entity in clientQuery
                            where entity.Id == policy.ClientId
                            select entity;

                    var matches = await query.ToListAsync();

                    if (matches.Any())
                        return matches;
                }
            }

            //If not matches, then try with DOB and LastName
            query = from entity in clientQuery
                    where EF.Functions.Like(entity.LastName, data.LastName)
                    && entity.DateOfBirth == data.DateOfBirth
                    select entity;

            return await query.ToListAsync();

        }

        private async Task<Result> ImportPolicy(ScopeOptions scope, ImportClient data, ClientEdit client, Guid userId)
        {
            var result = new Result(true);

            if (string.IsNullOrWhiteSpace(data.PolicyNumber))
                return result;

            var policy = await _policyService.GetPolicy(scope, client.Id.Value, data.PolicyCompanyId.Value, data.PolicyNumber);
            var policyTypes = await _lookupService.GetPolicyTypes();

            //Policy exits, update
            if (policy != null)
            {
                policy = MapPolicyProperties(policy, data, userId, policyTypes);

                result = await _policyService.UpdatePolicy(scope, policy);

                if (!result.Success)
                    return result;
            }
            else //else insert
            {
                policy = new PolicyEdit()
                {
                    ClientId = client.Id,
                    CompanyId = data.PolicyCompanyId.Value,
                    Number = data.PolicyNumber
                };

                policy = MapPolicyProperties(policy, data, userId, policyTypes);

                result = await _policyService.InsertPolicy(scope, policy);

                if (!result.Success)
                    return result;
            }

            return result;
        }

        private async Task<Result> ImportEmail(ScopeOptions scope, ImportClient data, ClientEdit client)
        {
            var result = new Result(true);

            if (string.IsNullOrEmpty(data.Email))
                return result;

            //See if email exits
            var email = await _contactService.GetContact(scope, client.Id.Value, data.Email);

            if (email == null)
            {
                var contact = new Contact()
                {
                    ClientId = client.Id,
                    Value = data.Email,
                    ContactTypeId = ContactType.CONTACT_TYPE_EMAIL
                };

                result = await _contactService.InsertContact(scope, contact);
            }

            return result;
        }

        private async Task<Result> ImportCellphone(ScopeOptions scope, ImportClient data, ClientEdit client)
        {
            var result = new Result(true);

            if (string.IsNullOrEmpty(data.Cellphone))
                return result;

            //Clean
            data.Cellphone = data.Cellphone.Replace(" ", "").Replace("-", "");

            //See if email exits
            var email = await _contactService.GetContact(scope, client.Id.Value, data.Cellphone);

            if (email == null)
            {
                var contact = new Contact()
                {
                    ClientId = client.Id,
                    Value = data.Cellphone,
                    ContactTypeId = ContactType.CONTACT_TYPE_CELLPHONE
                };

                result = await _contactService.InsertContact(scope, contact);
            }

            return result;
        }

        private PolicyEdit MapPolicyProperties(PolicyEdit policy, ImportClient data, Guid userId, List<PolicyType> policyTypes)
        {
            policy.UserId = userId;
            policy.Premium = data.PolicyPremium != null ? data.PolicyPremium : policy.Premium;
            policy.StartDate = data.PolicyStartDate != null ? data.PolicyStartDate : policy.StartDate;
            policy.PolicyTypeId = GetPolicyTypeId(data.PolicyType, policyTypes);

            return policy;
        }

        private Guid? GetPolicyTypeId(string policyTypeCode, List<PolicyType> policyTypes)
        {
            var policyType = policyTypes.FirstOrDefault(p => p.Code.IgnoreCaseEquals(policyTypeCode));

            if (policyType == null)
                return null;

            return policyType.Id;
        }
    }
}