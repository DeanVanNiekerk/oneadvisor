import { createSelector } from "reselect";

import { contextSelector } from "@/state/context/selectors";
import { RootState } from "@/state/rootReducer";

import { Company } from "../types";
import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.lookups.companies.list;

export const companiesSelector: (state: RootState) => State = createSelector(rootSelector, root => root);

export const organisationCompaniesSelector: (state: RootState) => Company[] = createSelector(
    rootSelector,
    contextSelector,
    (root, context) => {
        if (!context.organisation) return root.items;

        const organisationCompanyIds = context.organisation.config.companyIds;

        return root.items.filter(c => organisationCompanyIds.indexOf(c.id) !== -1);
    }
);
