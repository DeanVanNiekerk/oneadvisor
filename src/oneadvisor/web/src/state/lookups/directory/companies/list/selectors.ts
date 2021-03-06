import { createSelector } from "reselect";

import { RootState } from "@/state";
import { contextSelector } from "@/state/context/selectors";
import { Fund } from "@/state/directory/organisations/types";

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
        if (!context.organisation) return [];

        const organisationCompanyIds = context.organisation.config.companyIds;

        return root.items.filter((c) => organisationCompanyIds.indexOf(c.id) !== -1);
    }
);

export const organisationFundsSelector: (state: RootState) => Fund[] = createSelector(
    rootSelector,
    contextSelector,
    (root, context) => {
        if (!context.organisation) return [];

        const funds = context.organisation.config.funds;

        funds.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });

        return funds;
    }
);
