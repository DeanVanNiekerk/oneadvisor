using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Helpers;
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
            RuleFor(t => t.EndDate).GreaterThan(t => t.StartDate).When(t => t.StartDate.HasValue && t.EndDate.HasValue).WithMessage("End Date must be greater than the Start Date");
        }
    }

    public class ConfigValidator : AbstractValidator<Config>
    {
        public ConfigValidator()
        {
            RuleFor(t => t.Sheets).NotEmpty();
            RuleForEach(t => t.Sheets).SetValidator(new SheetValidator());
            RuleFor(t => t.Sheets).Must(HaveUnqiueSheetPositions).WithMessage("There are duplicate Sheet Positions");
        }

        private bool HaveUnqiueSheetPositions(IEnumerable<Sheet> sheets)
        {
            var positions = sheets.Select(f => f.Position);
            return positions.Distinct().Count() == sheets.Count();
        }
    }

    public class SheetValidator : AbstractValidator<Sheet>
    {
        public SheetValidator()
        {
            RuleFor(t => t.Position).GreaterThanOrEqualTo(1);

            RuleFor(t => t.Config).NotNull();
            RuleFor(t => t.Config).SetValidator(new SheetConfigValidator());
        }
    }

    public class SheetConfigValidator : AbstractValidator<SheetConfig>
    {
        public SheetConfigValidator()
        {
            RuleFor(t => t.HeaderIdentifier).NotNull();
            RuleFor(t => t.HeaderIdentifier).SetValidator(new HeaderIdentifierValidator());

            RuleFor(t => t.AmountIdentifier).NotNull();
            RuleFor(t => t.AmountIdentifier).SetValidator(new AmountIdentifierValidator());

            RuleFor(t => t.Fields).Must(HaveUnqiueFieldNames).WithMessage("There are duplicate Field Mappings");
            RuleFor(t => t.Fields).Must(HaveUnqiueFieldColumns).WithMessage("There are duplicate Column Mappings");

            When(t => string.IsNullOrWhiteSpace(t.AmountIdentifier.Column), () =>
            {
                RuleFor(t => t.Fields).Must(HaveAmountIncludingVatRequiredFieldNames).WithMessage("'Policy Number' AND ('Amount Including VAT' OR 'Amount Excluding VAT') fields are required");
            });

            When(t => !string.IsNullOrWhiteSpace(t.AmountIdentifier.Column), () =>
            {
                RuleFor(t => t.Fields).Must(HaveAmountRequiredFieldNames).WithMessage("'Policy Number' AND 'Amount' fields are required");
                RuleFor(t => t.Fields).Must(NotHaveAmountFieldNames).WithMessage("'Amount Including VAT' and 'Amount Excluding VAT' fields are not supported as an 'Amount Identifier' is set");
            });

            When(t => !string.IsNullOrWhiteSpace(t.ExchangeRates.HeaderIdentifier.Column), () =>
            {
                RuleFor(t => t.Fields).Must(HaveExchangeRateRequiredFieldNames).WithMessage("'Currency' field is required when Exhange Rates are set");
            });

            RuleForEach(t => t.Fields).SetValidator(new FieldValidator());

            RuleForEach(t => t.VatRates).SetValidator(new VATRatesValidator());

            RuleFor(t => t.ExchangeRates).SetValidator(new ExchangeRatesValidator());

            RuleFor(t => t.CommissionTypes).NotNull();
            RuleFor(t => t.CommissionTypes).SetValidator(new CommissionTypesValidator());

            RuleFor(t => t.Groups).Must(HaveUnqiueGroupFieldNames).WithMessage("There are duplicate Group Field Names");
            RuleForEach(t => t.Groups).SetValidator(new GroupValidator());
        }

        private bool HaveUnqiueFieldNames(IEnumerable<Field> fields)
        {
            var fieldNames = fields.Select(f => f.Name);
            return fieldNames.Distinct().Count() == fieldNames.Count();
        }

        private bool HaveUnqiueFieldColumns(IEnumerable<Field> fields)
        {
            var fieldColumns = fields.Select(f => f.Column);
            return fieldColumns.Distinct().Count() == fieldColumns.Count();
        }

        private bool HaveUnqiueGroupFieldNames(IEnumerable<Group> groups)
        {
            var groupsFieldNames = groups.Select(f => f.FieldName);
            return groupsFieldNames.Distinct().Count() == groupsFieldNames.Count();
        }

        private bool HaveAmountIncludingVatRequiredFieldNames(IEnumerable<Field> fields)
        {
            var hasPolicyNumber = fields.Any(f => f.Name == "PolicyNumber");
            if (!hasPolicyNumber)
                return false;

            return fields.Any(f => f.Name == "AmountIncludingVAT" || f.Name == "AmountExcludingVAT");
        }

        private bool HaveAmountRequiredFieldNames(IEnumerable<Field> fields)
        {
            var hasPolicyNumber = fields.Any(f => f.Name == "PolicyNumber");
            if (!hasPolicyNumber)
                return false;

            return fields.Any(f => f.Name == "Amount");
        }

        private bool HaveExchangeRateRequiredFieldNames(IEnumerable<Field> fields)
        {
            return fields.Any(f => f.Name == "Currency");
        }

        private bool NotHaveAmountFieldNames(IEnumerable<Field> fields)
        {
            return !fields.Any(f => f.Name == "AmountIncludingVAT" || f.Name == "AmountExcludingVAT");
        }
    }

    internal class HeaderIdentifierValidator : AbstractValidator<Identifier>
    {
        public HeaderIdentifierValidator()
        {
            RuleFor(t => t.Column).MustBeValidExcelColumn();
            RuleFor(t => t.Value).NotEmpty();
        }
    }

    internal class AmountIdentifierValidator : AbstractValidator<AmountIdentifier>
    {
        public AmountIdentifierValidator()
        {
            When(t => !string.IsNullOrWhiteSpace(t.Column), () =>
            {
                RuleFor(t => t.Column).MustBeValidExcelColumn();
                RuleFor(t => t.Value).NotEmpty();
                RuleFor(t => t.Type).Must(BeValidType).WithMessage($"Must be one of: {string.Join(',', AmountIdentifier.GetTypes())}");
            });
        }

        private bool BeValidType(string type)
        {
            return AmountIdentifier.GetTypes().Contains(type);
        }
    }

    internal class FieldValidator : AbstractValidator<Field>
    {
        private IEnumerable<string> _fieldNames = Enum.GetNames(typeof(FieldNames));

        public FieldValidator()
        {
            RuleFor(t => t.Column).MustBeValidExcelColumn().WithName("Column");
            RuleFor(t => t.Name).Must(BeValidFieldName).WithMessage("Invalid Field Name");
        }

        private bool BeValidFieldName(string fieldName)
        {
            return _fieldNames.Any(f => f == fieldName);
        }
    }

    internal class VATRatesValidator : AbstractValidator<VATRate>
    {
        public VATRatesValidator()
        {
            RuleFor(t => t.Column).MustBeValidExcelColumn().WithName("Column");
        }
    }

    internal class CommissionTypesValidator : AbstractValidator<CommissionTypes>
    {
        public CommissionTypesValidator()
        {
            RuleFor(t => t.MappingTemplate)
                .Must(HaveValidExcelColumnIdentifiers)
                .When(t => !string.IsNullOrEmpty(t.MappingTemplate))
                .WithMessage("'Mapping Template' contains invalid excel column identifiers");

            RuleFor(t => t.DefaultCommissionTypeCode).NotEmpty().WithName("Default Commission Type");

            RuleForEach(t => t.Types).SetValidator(new CommissionTypeValidator());
            RuleForEach(t => t.Types)
               .Custom((type, context) =>
               {
                   var mappingTemplate = ((CommissionTypes)context.ParentContext.InstanceToValidate).MappingTemplate;
                   if (!MappingTemplate.EqualLength(mappingTemplate, type.Value))
                   {
                       var failure = new ValidationFailure($"{context.PropertyName}.Value", "Invalid Value", type.Value);
                       context.AddFailure(failure);
                   }
               });
        }

        private bool HaveValidExcelColumnIdentifiers(string mappingTemplate)
        {
            foreach (var part in MappingTemplate.Parse(mappingTemplate))
            {
                try
                {
                    var column = MappingTemplate.GetColumn(part);
                    var subStringIndex = MappingTemplate.GetSubStringIndex(part);

                    if (subStringIndex.Count != 0 && subStringIndex.Count != 2)
                        return false;

                    if (subStringIndex.Count == 2)
                    {
                        if (subStringIndex[0] >= subStringIndex[1])
                            return false;
                    }

                    if (!Utils.IsValidExcelColumn((column)) && column != CommissionTypes.GROUP_COMMISSION_TYPE)
                        return false;
                }
                catch
                {
                    return false;
                }
            }
            return true;
        }

        private bool HaveUnqiueCommissionTypes(IEnumerable<CommissionType> types)
        {
            var commissionTypeIds = types.Select(t => t.CommissionTypeCode);
            return commissionTypeIds.Distinct().Count() == commissionTypeIds.Count();
        }
    }

    internal class CommissionTypeValidator : AbstractValidator<CommissionType>
    {
        public CommissionTypeValidator()
        {
            RuleFor(t => t.CommissionTypeCode).NotEmpty().WithName("Type");
            RuleFor(t => t.Value).NotEmpty();
        }
    }

    internal class GroupValidator : AbstractValidator<Group>
    {
        private IEnumerable<string> _fieldNames = Enum.GetNames(typeof(GroupFieldNames));

        public GroupValidator()
        {
            RuleFor(t => t.FieldName).Must(BeValidFieldName).WithMessage("Invalid Field Name");
            RuleFor(t => t.Column).MustBeValidExcelColumn();
            RuleFor(t => t.Identifiers).Must(HaveUnqiueIdentifierColumns).WithMessage("There are duplicate Column Mappings");
            RuleForEach(t => t.Identifiers).SetValidator(new GroupIdentifierValidator());
            RuleFor(t => t.Identifiers).NotEmpty().WithMessage("At least one identifier is required");
        }

        private bool HaveUnqiueIdentifierColumns(IEnumerable<Identifier> identifiers)
        {
            var identifierColumns = identifiers.Select(f => f.Column);
            return identifierColumns.Distinct().Count() == identifierColumns.Count();
        }

        private bool BeValidFieldName(string fieldName)
        {
            return _fieldNames.Any(f => f == fieldName);
        }
    }

    internal class GroupIdentifierValidator : AbstractValidator<Identifier>
    {
        public GroupIdentifierValidator()
        {
            RuleFor(t => t.Column).MustBeValidExcelColumn();
            RuleFor(t => t.Value).NotEmpty();
        }
    }

    internal class ExchangeRatesValidator : AbstractValidator<ExchangeRates>
    {
        public ExchangeRatesValidator()
        {
            When(t => !string.IsNullOrWhiteSpace(t.HeaderIdentifier.Column), () =>
            {
                RuleFor(t => t.HeaderIdentifier).SetValidator(new HeaderIdentifierValidator());
                RuleFor(t => t.CurrencyColumn).MustBeValidExcelColumn();
                RuleFor(t => t.ExchangeRateColumn).MustBeValidExcelColumn();
            });
        }
    }
}