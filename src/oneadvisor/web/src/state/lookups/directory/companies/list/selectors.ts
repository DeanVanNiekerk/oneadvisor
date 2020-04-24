import { createSelector } from "reselect";

import { RootState } from "@/state";
import { contextSelector } from "@/state/context/selectors";

import { CompanyListState } from "../";
import { Company } from "../types";

const rootSelector = (state: RootState): CompanyListState => state.lookups.directory.companies.list;

export const companiesSelector: (state: RootState) => CompanyListState = createSelector(
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
