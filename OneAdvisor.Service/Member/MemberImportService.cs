using System;
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
using OneAdvisor.Model.Member.Model.MemberPolicy;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;

namespace OneAdvisor.Service.Member
{
    public class MemberImportService : IMemberImportService
    {
        private readonly DataContext _context;
        private readonly IMemberService _memberService;
        private readonly IMemberPolicyService _memberPolicyService;

        public MemberImportService(DataContext context, IMemberService memberService, IMemberPolicyService memberPolicyService)
        {
            _context = context;
            _memberService = memberService;
            _memberPolicyService = memberPolicyService;
        }

        public async Task<Result> ImportMember(ScopeOptions scope, ImportMember data)
        {
            var validator = new ImportMemberValidator(false);
            var result = validator.Validate(data).GetResult();

            if (!result.Success)
                return result;

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
            var memberQuery = ScopeQuery.GetMemberEntityQuery(_context, scope);

            var query = from entity in memberQuery
                        where entity.IdNumber == data.IdNumber
                        || entity.PassportNumber == data.IdNumber
                        select entity;


            MemberEdit member = null;
            var memberEntity = await query.FirstOrDefaultAsync();

            //Member exits, check member is in scope
            if (memberEntity != null)
            {
                member = await _memberService.GetMember(scope, memberEntity.Id);

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

                var id = new IdNumber(data.IdNumber);
                if (id.IsValid)
                    member.IdNumber = data.IdNumber;
                else
                    member.PassportNumber = data.IdNumber;

                result = await _memberService.InsertMember(scope, member);

                if (!result.Success)
                    return result;

                member = (MemberEdit)result.Tag;
            }

            result = await ImportMemberPolicy(scope, data, member, userId);

            return result;
        }

        private async Task<Result> ImportMemberPolicy(ScopeOptions scope, ImportMember data, MemberEdit member, string userId)
        {
            var result = new Result(true);

            if (string.IsNullOrWhiteSpace(data.PolicyNumber))
                return result;

            var policy = await _memberPolicyService.GetPolicy(scope, member.Id.Value, data.PolicyCompanyId.Value, data.PolicyNumber);

            //Policy exits, update
            if (policy != null)
            {
                policy.UserId = userId;

                result = await _memberPolicyService.UpdatePolicy(scope, policy);

                if (!result.Success)
                    return result;
            }
            else //else insert
            {
                policy = new MemberPolicyEdit()
                {
                    MemberId = member.Id.Value,
                    CompanyId = data.PolicyCompanyId.Value,
                    Number = data.PolicyNumber,
                    UserId = userId
                };

                result = await _memberPolicyService.InsertPolicy(scope, policy);

                if (!result.Success)
                    return result;
            }

            return result;
        }
    }
}