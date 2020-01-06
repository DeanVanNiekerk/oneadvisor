import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { getValidationSubSet, ValidationResult } from "@/app/validation";
import { RootState } from "@/state/rootReducer";

import { CommissionTypes, Config, Identifier, Sheet, SheetConfig } from "../";
import { AmountIdentifier, Field, Group, VATRate } from "../types";
import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.templates.template;

export const commissionStatementTemplateSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const commissionStatementTemplateConfigSelector: (
    state: RootState
) => Config | null = createSelector(rootSelector, root =>
    root.template ? root.template.config : null
);

export const commissionStatementTemplateSheetsSelector: (
    state: RootState
) => Sheet[] = createSelector(rootSelector, root =>
    root.template ? root.template.config.sheets : []
);

export const commissionStatementTemplateSheetIndexSelector: (
    state: RootState
) => number = createSelector(rootSelector, root => root.templateSheetIndex);

export const commissionStatementTemplateValidationResultsSelector: (
    state: RootState
) => ValidationResult[] = createSelector(rootSelector, root => root.validationResults);

export const commissionStatementTemplateConfigValidationResultsSelector: (
    state: RootState
) => ValidationResult[] = createSelector(
    commissionStatementTemplateSheetIndexSelector,
    commissionStatementTemplateValidationResultsSelector,
    (templateSheetIndex, validationResults) => {
        return getValidationSubSet(
            `config.sheets[${templateSheetIndex}].config`,
            validationResults
        );
    }
);

export const commissionStatementTemplateIsModifiedSelector: (
    state: RootState
) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.template, root.templateOriginal)
);

export const commissionStatementTemplateSheetSelector: (
    state: RootState
) => Sheet | null = createSelector(
    commissionStatementTemplateSheetIndexSelector,
    commissionStatementTemplateConfigSelector,
    (templateSheetIndex, config) => {
        if (!config || config.sheets.length <= templateSheetIndex) return null;

        return config.sheets[templateSheetIndex];
    }
);

export const commissionStatementTemplateSheetConfigSelector: (
    state: RootState
) => SheetConfig | null = createSelector(commissionStatementTemplateSheetSelector, sheet =>
    sheet ? sheet.config : null
);

export const commissionStatementTemplateHeaderIdenifierConfigSelector: (
    state: RootState
) => Identifier | null = createSelector(commissionStatementTemplateSheetConfigSelector, config => {
    return config ? config.headerIdentifier : null;
});

export const commissionStatementTemplateAmountIdenifierConfigSelector: (
    state: RootState
) => AmountIdentifier | null = createSelector(
    commissionStatementTemplateSheetConfigSelector,
    config => {
        return config ? config.amountIdentifier : null;
    }
);

export const commissionStatementTemplateCommissionTypesConfigSelector: (
    state: RootState
) => CommissionTypes | null = createSelector(
    commissionStatementTemplateSheetConfigSelector,
    config => {
        return config ? config.commissionTypes : null;
    }
);

export const commissionStatementTemplateFieldsConfigSelector: (
    state: RootState
) => Field[] = createSelector(commissionStatementTemplateSheetConfigSelector, config => {
    return config ? config.fields : [];
});

export const commissionStatementTemplateGroupsConfigSelector: (
    state: RootState
) => Group[] = createSelector(commissionStatementTemplateSheetConfigSelector, config => {
    return config ? config.groups : [];
});

export const commissionStatementTemplateVATRatesConfigSelector: (
    state: RootState
) => VATRate[] = createSelector(commissionStatementTemplateSheetConfigSelector, config => {
    return config ? config.vatRates : [];
});

export const commissionStatementTemplateSheetPositionsSelector: (
    state: RootState
) => number[] = createSelector(commissionStatementTemplateSheetsSelector, sheets =>
    sheets.map(s => s.position)
);
