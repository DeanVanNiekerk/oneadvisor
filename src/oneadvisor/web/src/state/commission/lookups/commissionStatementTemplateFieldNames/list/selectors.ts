import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { CommissionStatementTemplateFieldNameListState } from "../";

const rootSelector = (state: RootState): CommissionStatementTemplateFieldNameListState =>
    state.commission.lookups.commissionStatementTemplateFieldNames.list;

export const commissionStatementTemplateFieldNamesSelector: (
    state: RootState
) => CommissionStatementTemplateFieldNameListState = createSelector(rootSelector, (root) => root);
