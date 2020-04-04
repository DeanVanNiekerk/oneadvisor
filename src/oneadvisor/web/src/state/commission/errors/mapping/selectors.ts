import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { MappingState } from "../";

const rootSelector = (state: RootState): MappingState => state.commission.errors.mapping;

export const mappingErrorSelector: (state: RootState) => MappingState = createSelector(
    rootSelector,
    (root) => root
);

export const mappingErrorIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.commissionError, root.commissionErrorOriginal)
);

export const mappingErrorIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);

export const mappingErrorCanSaveSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    mappingErrorIsLoadingSelector,
    (root, isLoading) => {
        if (root.commissionError === null || isLoading) return false;
        return !!root.commissionError.policyId && !!root.commissionError.clientId;
    }
);
