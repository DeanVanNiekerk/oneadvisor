import { ColumnProps } from "antd/lib/table";
import { format, getMonth, getYear, subMonths } from "date-fns";
import moment from "moment";
import { createSelector } from "reselect";

import { getColumnDefinition } from "@/app/table";
import { DATE_FORMAT } from "@/app/utils";
import { policyTypesSelector } from "@/state/app/client/lookups";
import { State as PolicyTypesState } from "@/state/app/client/lookups/policyTypes/list/reducer";
import { companiesSelector } from "@/state/app/directory/lookups";
import { State as CompaniesState } from "@/state/app/directory/lookups/companies/list/reducer";
import { RootState } from "@/state/rootReducer";

import { PastRevenueCommissionData } from "../";
import { commissionEarningsTypesSelector } from "../../lookups";
import { State as CommissionEarningsTypesState } from "../../lookups/commissionEarningsTypes/list/reducer";
import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.reports.projections;

export const commissionProjectionsSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const pastMonthsCountSelector: (state: RootState) => number = createSelector(
    rootSelector,
    root => {
        if (!root.filters || !root.filters.startDate) return 0;

        const startDate = root.filters.startDate[0];

        return moment().diff(startDate, "months");
    }
);

export const projectionTotalsTableColumnsSelector: (state: RootState) => ColumnProps<any>[] = createSelector(
    rootSelector,
    pastMonthsCountSelector,
    (root: State, pastMonthsCount: number) => {
        var getColumn = getColumnDefinition();

        const columns = [
            getColumn(
                "earningsType",
                "",
                {},
                {
                    fixed: "left",
                    sorter: false,
                    width: "600px",
                }
            ),
        ];

        return columns.concat(getMonthColumns(pastMonthsCount));
    }
);

export const projectionTotalsTableRowsSelector: (state: RootState) => object[] = createSelector(
    rootSelector,
    pastMonthsCountSelector,
    commissionEarningsTypesSelector,
    (root: State, pastMonthsCount: number, commissionEarningsTypesState: CommissionEarningsTypesState) => {
        const now = new Date();

        const rows: object[] = [];

        let totalRow = { earningsType: "Total Commission" };
        totalRow = getTableRow(totalRow, pastMonthsCount, now, root.items);
        rows.push(totalRow);

        commissionEarningsTypesState.items.forEach(earningsType => {
            const filter: TableRowFilter = d => d.commissionEarningsTypeId === earningsType.id;

            let row = { earningsType: earningsType.name };
            row = getTableRow(row, pastMonthsCount, now, root.items, filter);

            rows.push(row);
        });

        return rows;
    }
);

export const projectionGroupsTableColumnsSelector: (state: RootState) => ColumnProps<any>[] = createSelector(
    rootSelector,
    pastMonthsCountSelector,
    commissionEarningsTypesSelector,
    policyTypesSelector,
    companiesSelector,
    (
        root: State,
        pastMonthsCount: number,
        commissionEarningsTypesState: CommissionEarningsTypesState,
        policyTypesState: PolicyTypesState,
        companiesState: CompaniesState
    ) => {
        var getColumn = getColumnDefinition();

        const columns = [
            getColumn(
                "policyTypeId",
                "Policy Type",
                {},
                {
                    fixed: "left",
                    width: "200px",
                    render: (policyTypeId: string) => {
                        const type = policyTypesState.items.find(c => c.id === policyTypeId);
                        if (!type) return "Unknown";
                        return type.name;
                    },
                }
            ),
            getColumn(
                "commissionEarningsTypeId",
                "Earnings Type",
                {},
                {
                    fixed: "left",
                    width: "200px",
                    render: (commissionEarningsTypeId: string) => {
                        const type = commissionEarningsTypesState.items.find(c => c.id === commissionEarningsTypeId);
                        if (!type) return "";
                        return type.name;
                    },
                }
            ),
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    fixed: "left",
                    width: "200px",
                    render: (companyId: string) => {
                        const company = companiesState.items.find(c => c.id === companyId);
                        if (!company) return "";
                        return company.name;
                    },
                }
            ),
        ];

        return columns.concat(getMonthColumns(pastMonthsCount));
    }
);

export const projectionGroupTableRowsSelector: (state: RootState) => object[] = createSelector(
    rootSelector,
    pastMonthsCountSelector,
    (root: State, pastMonthsCount: number) => {
        const now = new Date();

        const rows: object[] = [];

        let index: number = 0;

        let uniquePolicyTypeIds = [...new Set(root.items.map(i => i.policyTypeId))];

        uniquePolicyTypeIds.forEach(policyTypeId => {
            let uniqueCommissionEarningsTypeIds = [
                ...new Set(
                    root.items.filter(i => i.policyTypeId === policyTypeId).map(i => i.commissionEarningsTypeId)
                ),
            ];

            uniqueCommissionEarningsTypeIds.forEach(commissionEarningsTypeId => {
                let companyIds = [
                    ...new Set(
                        root.items
                            .filter(
                                i =>
                                    i.policyTypeId === policyTypeId &&
                                    i.commissionEarningsTypeId === commissionEarningsTypeId
                            )
                            .map(i => i.companyId)
                    ),
                ];

                companyIds.forEach(companyId => {
                    const filter: TableRowFilter = d =>
                        d.commissionEarningsTypeId === commissionEarningsTypeId &&
                        d.policyTypeId === policyTypeId &&
                        d.companyId === companyId;

                    let row = {
                        index: index,
                        policyTypeId: policyTypeId,
                        commissionEarningsTypeId: commissionEarningsTypeId,
                        companyId: companyId,
                    };
                    row = getTableRow(row, pastMonthsCount, now, root.items, filter);

                    index = index + 1;

                    rows.push(row);
                });
            });
        });

        return rows;
    }
);

type TableRowFilter = (data: PastRevenueCommissionData) => boolean;
const getTableRow = (
    row: any,
    monthsBack: number,
    now: Date,
    items: PastRevenueCommissionData[],
    filter?: TableRowFilter
) => {
    while (monthsBack >= 0) {
        const current = subMonths(now, monthsBack);

        const key = format(current, DATE_FORMAT);

        const year = getYear(current);
        const month = getMonth(current) + 1;

        let filtered = items.filter(d => d.dateYear === year && d.dateMonth === month);

        if (filter) filtered = filtered.filter(filter);

        const value = filtered.reduce((p, c) => c.amountExcludingVAT + p, 0);

        row[key] = value;

        monthsBack = monthsBack - 1;
    }

    return row;
};

const getMonthColumns = (monthsBack: number): ColumnProps<any>[] => {
    var getColumn = getColumnDefinition();

    const columns: ColumnProps<any>[] = [];

    const now = new Date();

    while (monthsBack >= 0) {
        const current = subMonths(now, monthsBack);

        const key = format(current, DATE_FORMAT);
        const title = monthsBack === 0 ? "Current" : format(current, "MMM");

        const column = getColumn(
            key,
            title,
            {
                type: "currency",
            },
            {}
        );

        columns.push(column);

        monthsBack = monthsBack - 1;
    }

    return columns;
};
