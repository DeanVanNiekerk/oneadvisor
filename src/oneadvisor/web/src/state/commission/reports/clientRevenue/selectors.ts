import { createSelector } from "reselect";

import { RootState } from "@/state";
import { BarDatum } from "@nivo/bar";

import { ClientRevenueData, ClientRevenueState } from "./types";

const rootSelector = (state: RootState): ClientRevenueState =>
    state.commission.reports.clientRevenue;

export const clientRevenueSelector: (state: RootState) => ClientRevenueState = createSelector(
    rootSelector,
    (root) => root
);

export const clientRevenueBandsDataSelector: (state: RootState) => BarDatum[] = createSelector(
    rootSelector,
    (root) => {
        const { items } = root;

        return [
            {
                id: "R0 -> R200",
                "Monthly as and when": getRangeTotal(items, -1, 200),
            },
            {
                id: "R200 -> R400",
                "Monthly as and when": getRangeTotal(items, 200, 400),
            },
            {
                id: "R400 -> R600",
                "Monthly as and when": getRangeTotal(items, 400, 600),
            },
            {
                id: "R600 -> R800",
                "Monthly as and when": getRangeTotal(items, 600, 800),
            },
            {
                id: "R800 -> R1000",
                "Monthly as and when": getRangeTotal(items, 800, 1000),
            },
            {
                id: "> R1000",
                "Monthly as and when": getRangeTotal(items, 1000),
            },
        ];
    }
);

const getRangeTotal = (
    items: ClientRevenueData[],
    min: number,
    max: number = Number.MAX_VALUE
): number => {
    return items
        .filter((d) => d.monthlyAnnuityMonth > min && d.monthlyAnnuityMonth <= max)
        .reduce((p, c) => {
            return c.monthlyAnnuityMonth + p;
        }, 0);
};
