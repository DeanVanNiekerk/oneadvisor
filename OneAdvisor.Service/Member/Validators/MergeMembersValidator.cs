
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Model.Member.Model.Merge;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Member.Validators
{
    public class MergeMembersValidator : AbstractValidator<MergeMembers>
    {
        private readonly DataContext _context;

        public MergeMembersValidator(DataContext dataContext)
        {
            _context = dataContext;

            RuleFor(m => m.SourceMemberIds).NotEmpty().WithName("Source Member Ids");
            RuleFor(m => m.TargetMember).NotNull().WithName("Target Member");

            When(m => m.TargetMember != null, () =>
            {
                RuleFor(m => m).Custom(TargetIdNumberExistsInSource);
            });
        }

        private void TargetIdNumberExistsInSource(MergeMembers merge, CustomContext context)
        {
            var idNumbers = _context.Member.Where(m => merge.SourceMemberIds.Contains(m.Id)).Select(m => m.IdNumber).ToList();

            if (!idNumbers.Any(m => m == merge.TargetMember.IdNumber))
            {
                var failure = new ValidationFailure("IdNumber", "ID Number must be equal to one of the existing member ID Numbers", merge.TargetMember.IdNumber);
                context.AddFailure(failure);
            }
        }
    }
}