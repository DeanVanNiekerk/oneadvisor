import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ComplianceState } from "./types";

const rootSelector = (state: RootState): ComplianceState => state.compliance;

export const complianceSelector: (state: RootState) => ComplianceState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);
