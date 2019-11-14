
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionStatementValidator : AbstractValidator<CommissionStatementEdit>
    {
        private readonly DataContext _context;
        private readonly ScopeOptions _scope;

        public CommissionStatementValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _context = dataContext;
            _scope = scope;

            if (!isInsert)
            {
                RuleFor(o => o.Id).NotEmpty();
                RuleFor(m => m).Custom(StatementMustBeInScope);
            }

            RuleFor(o => o.CompanyId).NotEmpty().WithName("Company");
            RuleFor(o => o.AmountIncludingVAT).NotEmpty().InclusiveBetween(0, 999999999).WithName("Amount");
            RuleFor(o => o.VAT).NotEmpty().InclusiveBetween(0, 999999999).WithName("VAT");
            RuleFor(o => o.Date).NotEmpty().WithName("Date");
            RuleFor(o => o.Processed).NotEmpty().WithName("Processed");
        }

        private void StatementMustBeInScope(CommissionStatementEdit statement, CustomContext context)
        {
            var entity = _context.CommissionStatement.Where(c => c.Id == statement.Id).FirstOrDefault();

            if (entity == null || entity.OrganisationId != _scope.OrganisationId)
            {
                var failure = new ValidationFailure("SourceClientIds", "Invalid Source Client Ids");
                context.AddFailure(failure);
            }
        }
    }
}