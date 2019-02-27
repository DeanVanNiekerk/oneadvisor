using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Validation;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionStatementTemplateValidator : AbstractValidator<CommissionStatementTemplateEdit>
    {
        public CommissionStatementTemplateValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(t => t.Id).NotEmpty();

            RuleFor(t => t.Name).NotEmpty();
            RuleFor(t => t.CompanyId).NotEmpty().WithName("Company");
            RuleFor(t => t.Config).NotNull();
            RuleFor(t => t.Config).SetValidator(new ConfigValidator());
        }
    }

    internal class ConfigValidator : AbstractValidator<Config>
    {
        public ConfigValidator()
        {
            RuleFor(t => t.DataStart).NotNull();
            RuleFor(t => t.DataStart).SetValidator(new DataStartValidator());

            RuleFor(t => t.Fields).Must(HaveUnqiueFieldNames).WithMessage("Field Names must be unique");
            RuleFor(t => t.Fields).Must(HaveRequiredFieldNames).WithMessage("'Policy Number' AND ('Amount Including VAT' OR 'Amount Excluding VAT') fields are required");
            RuleForEach(t => t.Fields).SetValidator(new FieldValidator());
        }

        private bool HaveUnqiueFieldNames(IEnumerable<Field> fields)
        {
            var fieldNames = fields.Select(f => f.Name);
            return fieldNames.Distinct().Count() == fieldNames.Count();
        }

        private bool HaveRequiredFieldNames(IEnumerable<Field> fields)
        {
            var hasPolicyNumber = fields.Any(f => f.Name == "PolicyNumber");
            if (!hasPolicyNumber)
                return false;

            return fields.Any(f => f.Name == "AmountIncludingVAT" || f.Name == "AmountExcludingVAT");
        }
    }

    internal class DataStartValidator : AbstractValidator<DataStart>
    {
        public DataStartValidator()
        {
            RuleFor(t => t.HeaderColumn).MustBeValidExcelColumn().WithName("Header Column");
            RuleFor(t => t.HeaderValue).NotEmpty().WithName("Header Value");
        }
    }

    internal class FieldValidator : AbstractValidator<Field>
    {
        private IEnumerable<string> _fieldNames = Enum.GetNames(typeof(FieldNames));

        public FieldValidator()
        {
            RuleFor(t => t.Column).MustBeValidExcelColumn().WithName("Column");
            RuleFor(t => t.Name).Must(fieldName => _fieldNames.Any(f => f == fieldName)).WithMessage("Invalid Field Name");
        }

        private bool BeValidFieldName(string fieldName)
        {
            return _fieldNames.Any(f => f == fieldName);
        }
    }
}