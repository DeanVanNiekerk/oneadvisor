import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State =>
    state.app.client.policies.policy;

export const policySelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const policyIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.policy, root.policyOriginal)
);
