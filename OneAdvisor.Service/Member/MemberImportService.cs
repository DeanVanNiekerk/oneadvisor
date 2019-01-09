using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Exceptions;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;

namespace OneAdvisor.Service.Member
{
    public class MemberImportService : IMemberImportService
    {
        private readonly DataContext _context;
        private readonly IMemberService _memberService;

        public MemberImportService(DataContext context, IMemberService memberService)
        {
            _context = context;
        }

        public async Task<Result> ImportMember(ScopeOptions scope, ImportMember data)
        {
            var result = new Result();

            //Check if the member exists in the organisation
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from entity in _context.Member
                        join user in userQuery
                             on entity.UserId equals user.Id
                        where entity.IdNumber == data.IdNumber
                        select entity;


            MemberEdit member = null;
            var memberEntity = await query.FirstOrDefaultAsync();

            //Member exits, check member is in scope
            if (memberEntity != null)
            {
                member = await _memberService.GetMember(scope, memberEntity.Id);

                if (member == null)
                {
                    result.AddValidationFailure("IdNumber", "Member exists but is out of scope");
                    return result;
                }

                member.LastName = data.LastName;
                result = await _memberService.UpdateMember(scope, member);

                if (!result.Success)
                    return result;
            }
            else
            {
                member = new MemberEdit()
                {
                    LastName = data.LastName,
                    IdNumber = data.IdNumber
                };

                result = await _memberService.InsertMember(scope.UserId, member);

                if (!result.Success)
                    return result;
            }


            return result;
        }
    }
}