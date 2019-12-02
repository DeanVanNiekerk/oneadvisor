import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import { RootState } from "@/state/rootReducer";

import { Config, Sheet } from "../";
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

export const commissionStatementTemplateValidationResultsSelector: (
    state: RootState
) => ValidationResult[] = createSelector(rootSelector, root =>
    root.template ? root.validationResults : []
);

export const commissionStatementTemplateIsModifiedSelector: (
    state: RootState
) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.template, root.templateOriginal)
);
