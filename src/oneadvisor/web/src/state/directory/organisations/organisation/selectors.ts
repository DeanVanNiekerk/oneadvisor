import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { OrganisationState } from "../";

const rootSelector = (state: RootState): OrganisationState =>
    state.directory.organisations.organisation;

export const organisationSelector: (state: RootState) => OrganisationState = createSelector(
    rootSelector,
    (root) => root
);

export const organisationConfigCompanyIdsSelector: (
    state: RootState
) => string[] = createSelector(rootSelector, (root) =>
    root.organisation ? root.organisation.config.companyIds : []
);

export const organisationConfigApplicationIdsSelector: (
    state: RootState
) => string[] = createSelector(rootSelector, (root) =>
    root.organisation ? root.organisation.config.applicationIds : []
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
