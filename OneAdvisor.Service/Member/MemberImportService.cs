using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Interface;
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

        public MemberImportService(DataContext context, IMemberService memberService, IPolicyService policyService)
        {
            _context = context;
            _memberService = memberService;
            _policyService = policyService;
        }

        public async Task<Result> ImportMember(ScopeOptions scope, ImportMember data)
        {
            var validator = new ImportMemberValidator(false);
            var result = validator.Validate(data).GetResult();

            if (!result.Success)
                return result;

            //Clean id number
            if (!string.IsNullOrEmpty(data.IdNumber))
                data.IdNumber = data.IdNumber.Replace(" ", "");

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
                                || EF.Functions.Like(entity.Aliases, $"%{data.PolicyUserFullName}%")
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

                member.FirstName = data.FirstName != null ? data.FirstName : member.FirstName;
                member.LastName = data.LastName != null ? data.LastName : member.LastName;
                result = await _memberService.UpdateMember(scope, member);

                if (!result.Success)
                    return result;
            }
            else
            {
                member = new MemberEdit()
                {
                    FirstName = data.FirstName != null ? data.FirstName : string.Empty,
                    LastName = data.LastName != null ? data.LastName : string.Empty
                };

                member = LoadMemberIdNumber(member, data);

                result = await _memberService.InsertMember(scope, member);

                if (!result.Success)
                    return result;

                member = (MemberEdit)result.Tag;
            }

            result = await ImportPolicy(scope, data, member, userId);

            return result;
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
                //First try and match on IdNumber and PasswordNumber
                query = from entity in memberQuery
                        where entity.IdNumber == data.IdNumber
                        || entity.PassportNumber == data.IdNumber
                        select entity;

                var matches = await query.ToListAsync();

                if (matches.Any())
                    return matches;
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

            var policy = await _policyService.GetPolicy(scope, member.Id, data.PolicyCompanyId.Value, data.PolicyNumber);

            //Policy exits, update
            if (policy != null)
            {
                policy.UserId = userId;

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
                    Number = data.PolicyNumber,
                    UserId = userId
                };

                result = await _policyService.InsertPolicy(scope, policy);

                if (!result.Success)
                    return result;
            }

            return result;
        }
    }
}