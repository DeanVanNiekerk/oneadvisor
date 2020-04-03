import { createSelector } from "reselect";

import { companiesSelector, getCompanyName } from "@/state/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { PieDatum } from "@nivo/pie";

import { UserCompanyMonthlyCommissionState } from "./types";

const rootSelector = (state: RootState): UserCompanyMonthlyCommissionState =>
    state.commission.reports.userCompanyMonthlyCommission;

export const userCompanyMonthlyCommissionSelector: (
    state: RootState
) => UserCompanyMonthlyCommissionState = createSelector(rootSelector, (root) => root);

export const userCompanyMonthlyCommissionPieDataSelector: (
    state: RootState
) => PieDatum[] = createSelector(rootSelector, companiesSelector, (root, companies) => {
    return root.items
        .filter((r) => r.amountExcludingVAT > 0)
        .map((r) => {
            return {
                id: r.companyId,
                label: getCompanyName(r.companyId, companies.items),
                value: r.amountExcludingVAT,
            };
        });
});

export const userCompanyMonthlyCommissionTotalAmountExclVatSelector: (
    state: RootState
) => number = createSelector(rootSelector, companiesSelector, (root) =>
    root.items.reduce((p, c) => p + c.amountExcludingVAT, 0)
);
