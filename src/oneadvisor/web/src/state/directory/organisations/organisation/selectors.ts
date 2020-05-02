import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { getConfig } from "../helpers";
import { Config, OrganisationState } from "../types";

const rootSelector = (state: RootState): OrganisationState =>
    state.directory.organisations.organisation;

export const organisationSelector: (state: RootState) => OrganisationState = createSelector(
    rootSelector,
    (root) => root
);

export const organisationConfigSelector: (state: RootState) => Config = createSelector(
    rootSelector,
    (root) => (root.organisation ? root.organisation.config : getConfig())
);

export const organisationIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.organisation, root.organisationOriginal)
);

export const organisationIsNew: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !(root.organisation && root.organisation.id)
);

export const organisationIdSelector: (
    state: RootState
) => string | null = createSelector(rootSelector, (root) =>
    root.organisation ? root.organisation.id : null
);
