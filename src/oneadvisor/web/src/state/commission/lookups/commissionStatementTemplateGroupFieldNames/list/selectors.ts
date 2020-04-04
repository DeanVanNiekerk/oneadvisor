import { createSelector } from "reselect";

import { RootState } from "@/state";

import { CommissionStatementTemplateGroupFieldNameListState } from "../";

const rootSelector = (state: RootState): CommissionStatementTemplateGroupFieldNameListState =>
    state.commission.lookups.commissionStatementTemplateGroupFieldNames.list;

export const commissionStatementTemplateGroupFieldNamesSelector: (
    state: RootState
) => CommissionStatementTemplateGroupFieldNameListState = createSelector(
    rootSelector,
    (root) => root
);
