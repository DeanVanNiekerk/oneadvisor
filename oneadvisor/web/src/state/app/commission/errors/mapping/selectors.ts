import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.errors.mapping;

export const mappingErrorSelector: (state: RootState) => State = createSelector(rootSelector, root => root);

export const mappingErrorIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.commissionError, root.commissionErrorOriginal)
);

export const mappingErrorIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => root.updating || root.fetching
);

export const mappingErrorCanSaveSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    mappingErrorIsLoadingSelector,
    (root, isLoading) => {
        if (root.commissionError === null || isLoading) return false;
        return !!root.commissionError.policyId && !!root.commissionError.clientId;
    }
);
