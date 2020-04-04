import { createSelector } from "reselect";

import { RootState } from "@/state";
import { PieDatum } from "@nivo/pie";

import {
    commissionEarningsTypesSelector,
    getCommissionEarningsTypeName,
    UNKNOWN_COMMISSION_EARNINGS_TYPE_ID,
} from "../../lookups";
import {
    UserEarningsTypeMonthlyCommissionData,
    UserEarningsTypeMonthlyCommissionState,
} from "./types";

const rootSelector = (state: RootState): UserEarningsTypeMonthlyCommissionState =>
    state.commission.reports.userEarningsTypeMonthlyCommission;

export const userEarningsTypeMonthlyCommissionSelector: (
    state: RootState
) => UserEarningsTypeMonthlyCommissionState = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    (root) => root
);

export const userEarningsTypeMonthlyCommissionItemsSelector: (
    state: RootState
) => UserEarningsTypeMonthlyCommissionData[] = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    (root, commissionEarningsTypes) => {
        let types = commissionEarningsTypes.items.map((earningsType) => {
            const record = root.items.find((r) => r.commissionEarningsTypeId === earningsType.id);
            if (record) return record;

            return {
                commissionEarningsTypeId: earningsType.id,
                amountExcludingVAT: 0,
            };
        });

        //Filter out unknown earnings type if it has no value
        types = types.filter((t) => {
            if (
                t.commissionEarningsTypeId === UNKNOWN_COMMISSION_EARNINGS_TYPE_ID &&
                t.amountExcludingVAT === 0
            )
                return false;
            return true;
        });

        return types;
    }
);

export const userEarningsTypeMonthlyCommissionPieDataSelector: (
    state: RootState
) => PieDatum[] = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    (root, commissionEarningsTypes) => {
        return root.items
            .filter((r) => r.amountExcludingVAT > 0)
            .map((r) => {
                return {
                    id: r.commissionEarningsTypeId,
                    label: getCommissionEarningsTypeName(
                        r.commissionEarningsTypeId,
                        commissionEarningsTypes.items
                    ),
                    value: r.amountExcludingVAT,
                };
            });
    }
);

export const userEarningsTypeMonthlyCommissionTotalAmountExclVatSelector: (
    state: RootState
) => number = createSelector(rootSelector, (root) =>
    root.items.reduce((p, c) => p + c.amountExcludingVAT, 0)
);
