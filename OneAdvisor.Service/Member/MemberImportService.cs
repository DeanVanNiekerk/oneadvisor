using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Contact;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;

namespace OneAdvisor.Service.Member
{
    public class MemberImportService : IMemberImportService
    {
        private readonly DataContext _context;
        private readonly IMemberService _memberService;
        private readonly IPolicyService _policyService;
        private readonly IContactService _contactService;

        public MemberImportService(DataContext context, IMemberService memberService, IPolicyService policyService, IContactService contactService)
        {
            _context = context;
            _memberService = memberService;
            _policyService = policyService;
            _contactService = contactService;
        }

        public async Task<Result> ImportMember(ScopeOptions scope, ImportMember data)
        {
            var validator = new ImportMemberValidator(false);
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

            var userEntityQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

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

                var userQuery = from entity in userEntityQuery
                                where (EF.Functions.Like(entity.FirstName, parts[0])
                                && EF.Functions.Like(entity.LastName, parts[1]))
                                //TODO: fix
                                //|| EF.Functions.Like(entity.Aliases, $"%{data.PolicyUserFullName}%")
                                select entity;

                var user = userQuery.FirstOrDefault();

                if (user == null)
                {
                    result.AddValidationFailure("UserFullName", "Broker does not exist or is out of scope");
                    return result;
                }

                userId = user.Id;
            }

            //Check if the member exists in the organisation
            var members = await FindMember(scope, data);

            if (members.Count >= 2)
            {
                result.AddValidationFailure("", "There are multiple members matching this record, please increase specificity");
                return result;
            }

            var memberEntity = members.FirstOrDefault();

            MemberEdit member = null;

            //Member exits, check member is in scope
            if (memberEntity != null)
            {
                member = await _memberService.GetMember(scope, memberEntity.Id);

                member = LoadMemberIdNumber(member, data);

                member = MapMemberProperties(member, data);

                result = await _memberService.UpdateMember(scope, member);

                if (!result.Success)
                    return result;
            }
            else
            {
                member = new MemberEdit();
                member = LoadMemberIdNumber(member, data);
                member = MapMemberProperties(member, data);

                result = await _memberService.InsertMember(scope, member);

                if (!result.Success)
                    return result;

                member = (MemberEdit)result.Tag;
            }

            result = await ImportEmail(scope, data, member);

            if (!result.Success)
                return result;

            result = await ImportCellphone(scope, data, member);

            if (!result.Success)
                return result;

            result = await ImportPolicy(scope, data, member, userId);

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

        private MemberEdit MapMemberProperties(MemberEdit member, ImportMember data)
        {
            member.FirstName = data.FirstName != null ? data.FirstName : member.FirstName;
            member.LastName = data.LastName != null ? data.LastName : member.LastName;
            member.TaxNumber = data.TaxNumber != null ? data.TaxNumber : member.TaxNumber;
            member.DateOfBirth = data.DateOfBirth != null ? data.DateOfBirth : member.DateOfBirth;

            return member;
        }

        private MemberEdit LoadMemberIdNumber(MemberEdit member, ImportMember data)
        {
            if (string.IsNullOrWhiteSpace(data.IdNumber))
                return member;

            var id = new IdNumber(data.IdNumber);
            if (id.IsValid)
                member.IdNumber = data.IdNumber;
            else
                member.PassportNumber = data.IdNumber;

            return member;
        }

        private async Task<List<MemberEntity>> FindMember(ScopeOptions scope, ImportMember data)
        {
            //Check if the member exists in the organisation
            var memberQuery = ScopeQuery.GetMemberEntityQuery(_context, scope);

            IQueryable<MemberEntity> query;

            if (!string.IsNullOrWhiteSpace(data.IdNumber))
            {
                //First try and match on IdNumber and PassportNumber
                query = from entity in memberQuery
                        where entity.IdNumber == data.IdNumber
                        || entity.PassportNumber == data.IdNumber
                        select entity;

                var matches = await query.ToListAsync();

                if (matches.Any())
                    return matches;

                //If no match try with first 10 chars of Id number
                if (data.IdNumber.Count() >= 10)
                {
                    query = from entity in memberQuery
                            where EF.Functions.Like(entity.IdNumber, $"{data.IdNumber.Substring(0, 10)}%")
                            select entity;

                    matches = await query.ToListAsync();

                    if (matches.Any())
                        return matches;
                }
            }

            //If not matches, then try with DOB and LastName
            query = from entity in memberQuery
                    where EF.Functions.Like(entity.LastName, data.LastName)
                    && entity.DateOfBirth == data.DateOfBirth
                    select entity;

            return await query.ToListAsync();

        }

        private async Task<Result> ImportPolicy(ScopeOptions scope, ImportMember data, MemberEdit member, string userId)
        {
            var result = new Result(true);

            if (string.IsNullOrWhiteSpace(data.PolicyNumber))
                return result;

            var policy = await _policyService.GetPolicy(scope, member.Id.Value, data.PolicyCompanyId.Value, data.PolicyNumber);

            //Policy exits, update
            if (policy != null)
            {
                policy = MapPolicyProperties(policy, data, userId);

                result = await _policyService.UpdatePolicy(scope, policy);

                if (!result.Success)
                    return result;
            }
            else //else insert
            {
                policy = new PolicyEdit()
                {
                    MemberId = member.Id,
                    CompanyId = data.PolicyCompanyId.Value,
                    Number = data.PolicyNumber
                };

                policy = MapPolicyProperties(policy, data, userId);

                result = await _policyService.InsertPolicy(scope, policy);

                if (!result.Success)
                    return result;
            }

            return result;
        }

        private async Task<Result> ImportEmail(ScopeOptions scope, ImportMember data, MemberEdit member)
        {
            var result = new Result(true);

            if (string.IsNullOrEmpty(data.Email))
                return result;

            //See if email exits
            var email = await _contactService.GetContact(scope, member.Id.Value, data.Email);

            if (email == null)
            {
                var contact = new Contact()
                {
                    MemberId = member.Id,
                    Value = data.Email,
                    ContactTypeId = ContactType.CONTACT_TYPE_EMAIL
                };

                result = await _contactService.InsertContact(scope, contact);
            }

            return result;
        }

        private async Task<Result> ImportCellphone(ScopeOptions scope, ImportMember data, MemberEdit member)
        {
            var result = new Result(true);

            if (string.IsNullOrEmpty(data.Cellphone))
                return result;

            //Clean
            data.Cellphone = data.Cellphone.Replace(" ", "").Replace("-", "");

            //See if email exits
            var email = await _contactService.GetContact(scope, member.Id.Value, data.Cellphone);

            if (email == null)
            {
                var contact = new Contact()
                {
                    MemberId = member.Id,
                    Value = data.Cellphone,
                    ContactTypeId = ContactType.CONTACT_TYPE_CELLPHONE
                };

                result = await _contactService.InsertContact(scope, contact);
            }

            return result;
        }

        private PolicyEdit MapPolicyProperties(PolicyEdit policy, ImportMember data, string userId)
        {
            policy.UserId = userId;
            policy.Premium = data.PolicyPremium != null ? data.PolicyPremium : policy.Premium;
            policy.StartDate = data.PolicyStartDate != null ? data.PolicyStartDate : policy.StartDate;
            policy.PolicyTypeId = GetPolicyTypeId(data.PolicyType);

            return policy;
        }

        private Guid? GetPolicyTypeId(string policyType)
        {
            if (string.IsNullOrWhiteSpace(policyType))
                return null;

            //NB: when updating checking, ImportMemberValidator.cs
            switch (policyType.ToLower())
            {
                case "investment":
                    return PolicyType.POLICY_TYPE_INVESTMENT;
                case "life_insurance":
                    return PolicyType.POLICY_TYPE_LIFE_INSURANCE;
                case "short_term":
                    return PolicyType.POLICY_TYPE_SHORT_TERM;
                case "medical_cover":
                    return PolicyType.POLICY_TYPE_MEDICAL_COVER;
                case "rewards":
                    return PolicyType.POLICY_TYPE_REWARDS;
            }

            return null;
        }
    }
}