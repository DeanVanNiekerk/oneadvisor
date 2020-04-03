import { createSelector } from "reselect";

import { contextSelector } from "@/state/context/selectors";
import { RootState } from "@/state/rootReducer";

import { ListState } from "../";
import { Company } from "../types";

const rootSelector = (state: RootState): ListState => state.directory.lookups.companies.list;

export const companiesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);

export const organisationCompaniesSelector: (state: RootState) => Company[] = createSelector(
    rootSelector,
    contextSelector,
    (root, context) => {
        if (!context.organisation) return root.items;

        const organisationCompanyIds = context.organisation.config.companyIds;

        return root.items.filter((c) => organisationCompanyIds.indexOf(c.id) !== -1);
    }
);
