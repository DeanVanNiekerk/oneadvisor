using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
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
            RuleFor(t => t.HeaderIdentifier).NotNull();
            RuleFor(t => t.HeaderIdentifier).SetValidator(new HeaderIdentifierValidator());

            RuleFor(t => t.Fields).Must(HaveUnqiueFieldNames).WithMessage("There are duplicate Field Mappings");
            RuleFor(t => t.Fields).Must(HaveRequiredFieldNames).WithMessage("'Policy Number' AND ('Amount Including VAT' OR 'Amount Excluding VAT') fields are required");
            RuleForEach(t => t.Fields).SetValidator(new FieldValidator());

            RuleFor(t => t.CommissionTypes).NotNull();
            RuleFor(t => t.CommissionTypes).SetValidator(new CommissionTypestValidator());
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

    internal class HeaderIdentifierValidator : AbstractValidator<HeaderIdentifier>
    {
        public HeaderIdentifierValidator()
        {
            RuleFor(t => t.Column).MustBeValidExcelColumn();
            RuleFor(t => t.Value).NotEmpty();
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

    internal class CommissionTypestValidator : AbstractValidator<CommissionTypes>
    {
        public CommissionTypestValidator()
        {
            RuleFor(t => t.MappingTemplate).NotEmpty().WithName("Mapping Template");
            RuleFor(t => t.MappingTemplate).Must(HaveValidExcelColumnIdentifiers).WithMessage("'Mapping Template' contains invalid excel column identifiers");

            RuleFor(t => t.DefaultCommissionTypeId).NotEmpty().WithName("Default Commission Type");

            RuleFor(t => t.Types).Must(HaveUnqiueCommissionTypes).WithMessage("There are duplicate Commission Type Mappings");
            RuleForEach(t => t.Types).SetValidator(new CommissionTypeValidator());
            RuleForEach(t => t.Types)
               .Custom((type, context) =>
               {
                   var mappingTemplate = ((CommissionTypes)context.ParentContext.InstanceToValidate).MappingTemplate;
                   if (mappingTemplate.Split(CommissionTypes.COMMISSION_TYPE_SEPARATOR).Count() != type.Value.Split(CommissionTypes.COMMISSION_TYPE_SEPARATOR).Count())
                   {
                       var failure = new ValidationFailure($"{context.PropertyName}.Value", "Invalid Value", type.Value);
                       context.AddFailure(failure);
                   }
               });
        }

        private bool HaveValidExcelColumnIdentifiers(string mappingTemplate)
        {
            foreach (var column in mappingTemplate.Split(CommissionTypes.COMMISSION_TYPE_SEPARATOR))
            {
                if (!Utils.IsValidExcelColumn((column)))
                    return false;
            }
            return true;
        }

        private bool HaveUnqiueCommissionTypes(IEnumerable<CommissionType> types)
        {
            var commissionTypeIds = types.Select(t => t.CommissionTypeId);
            return commissionTypeIds.Distinct().Count() == commissionTypeIds.Count();
        }
    }

    internal class CommissionTypeValidator : AbstractValidator<CommissionType>
    {
        public CommissionTypeValidator()
        {
            RuleFor(t => t.CommissionTypeId).NotEmpty().WithName("Commission Type");
            RuleFor(t => t.Value).NotEmpty();
        }
    }
}