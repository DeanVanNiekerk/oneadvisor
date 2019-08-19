import { ColumnProps } from "antd/lib/table";
import moment from "moment";
import { createSelector } from "reselect";

import { getColumnDefinition } from "@/app/table";
import { DATE_FORMAT } from "@/app/utils";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import { State as PolicyTypesState } from "@/state/app/client/lookups/policyTypes/list/reducer";
import { Company, organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";

import { Group, GroupTableRecord, PastRevenueCommissionData } from "../";
import { CommissionEarningsType, commissionEarningsTypesSelector } from "../../lookups";
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

export const projectionGroupsTableColumnsSelector: (state: RootState) => ColumnProps<any>[] = createSelector(
    rootSelector,
    pastMonthsCountSelector,
    commissionEarningsTypesSelector,
    policyTypesSelector,
    organisationCompaniesSelector,
    (
        root: State,
        pastMonthsCount: number,
        commissionEarningsTypesState: CommissionEarningsTypesState,
        policyTypesState: PolicyTypesState,
        companies: Company[]
    ) => {
        const { groups } = root;

        var getColumn = getColumnDefinition<GroupTableRecord>();

        const columns: ColumnProps<GroupTableRecord>[] = [];

        const totalsText = "Totals";

        if (groups.some(g => g === "Policy Type"))
            columns.push(
                getColumn(
                    "policyTypeId",
                    "Policy Type",
                    {},
                    {
                        fixed: "left",
                        width: "170px",
                        sorter: false,
                        render: (policyTypeId: string, row: GroupTableRecord) => {
                            let value = getPolicyTypeName(policyTypeId, policyTypesState.items);
                            if (row.isTotalRow && row.policyTypeColSpan >= 1) value = totalsText;
                            const obj = {
                                children: value,
                                props: {
                                    rowSpan: row.policyTypeRowSpan,
                                    colSpan: row.policyTypeColSpan,
                                },
                            };

                            return obj;
                        },
                    }
                )
            );

        if (groups.some(g => g === "Earnings Type"))
            columns.push(
                getColumn(
                    "commissionEarningsTypeId",
                    "Earnings Type",
                    {},
                    {
                        fixed: "left",
                        width: "170px",
                        sorter: false,
                        render: (commissionEarningsTypeId: string, row: GroupTableRecord) => {
                            let value = getEarningsTypeName(
                                commissionEarningsTypeId,
                                commissionEarningsTypesState.items
                            );
                            if (row.isTotalRow && row.earningsTypeColSpan >= 1) value = totalsText;
                            const obj = {
                                children: value,
                                props: {
                                    rowSpan: row.earningsTypeRowSpan,
                                    colSpan: row.earningsTypeColSpan,
                                },
                            };

                            return obj;
                        },
                    }
                )
            );

        if (groups.some(g => g === "Company"))
            columns.push(
                getColumn(
                    "companyId",
                    "Company",
                    {},
                    {
                        fixed: "left",
                        width: "170px",
                        sorter: false,
                        render: (companyId: string, row: GroupTableRecord) => {
                            let value = getCompanyName(companyId, companies);
                            if (row.isTotalRow && row.companyColSpan >= 1) value = totalsText;
                            const obj = {
                                children: value,
                                props: {
                                    colSpan: row.companyColSpan,
                                },
                            };

                            return obj;
                        },
                    }
                )
            );

        return columns.concat(getMonthColumns(pastMonthsCount));
    }
);

const getPolicyTypeColSpan = (groups: Group[]) => {
    if (!groups.some(g => g === "Policy Type")) return 1;

    return groups.length;
};

const getEarningsTypeColSpan = (groups: Group[]) => {
    if (groups.some(g => g === "Policy Type")) return 0;

    if (!groups.some(g => g === "Earnings Type")) return 1;

    return groups.length;
};

const getCompanyColSpan = (groups: Group[]) => {
    if (groups.some(g => g === "Policy Type" || g === "Earnings Type")) return 0;

    return 1;
};

export const projectionGroupTableRowsSelector: (state: RootState) => object[] = createSelector(
    rootSelector,
    pastMonthsCountSelector,
    commissionEarningsTypesSelector,
    policyTypesSelector,
    organisationCompaniesSelector,
    (
        root: State,
        pastMonthsCount: number,
        commissionEarningsTypesState: CommissionEarningsTypesState,
        policyTypesState: PolicyTypesState,
        companies: Company[]
    ) => {
        const now = new Date();

        const { items, groups } = root;

        let rows: GroupTableRecord[] = [];

        let totalRow = {
            key: "",
            sortKey: "",
            earningsTypeGroupKey: "",
            earningsTypeRowSpan: 1,
            policyTypeRowSpan: 1,
            earningsTypeColSpan: getEarningsTypeColSpan(groups),
            policyTypeColSpan: getPolicyTypeColSpan(groups),
            companyColSpan: getCompanyColSpan(groups),
            isTotalRow: true,
        };
        totalRow = getTableRow(totalRow, pastMonthsCount, now, root.items);
        rows.push(totalRow);

        if (groups.length === 0) return rows;

        items.forEach(data => {
            let key = "";
            let sortKey = "";
            let earningsTypeGroupKey = "";
            if (groups.some(g => g === "Policy Type")) {
                key = key.concat(data.policyTypeId || "unknown");
                earningsTypeGroupKey = earningsTypeGroupKey.concat(data.policyTypeId || "unknown");
                sortKey = sortKey.concat(getPolicyTypeName(data.policyTypeId, policyTypesState.items));
            }

            if (groups.some(g => g === "Earnings Type")) {
                key = key.concat(data.commissionEarningsTypeId);
                earningsTypeGroupKey = earningsTypeGroupKey.concat(data.commissionEarningsTypeId);
                sortKey = sortKey.concat(
                    getEarningsTypeName(data.commissionEarningsTypeId, commissionEarningsTypesState.items)
                );
            }

            if (groups.some(g => g === "Company")) {
                key = key.concat(data.companyId);
                sortKey = sortKey.concat(getCompanyName(data.companyId, companies));
            }

            if (rows.some(r => r.key === key)) return;

            const filter: TableRowFilter = d => {
                if (groups.some(g => g === "Policy Type") && d.policyTypeId !== data.policyTypeId) return false;

                if (
                    groups.some(g => g === "Earnings Type") &&
                    d.commissionEarningsTypeId !== data.commissionEarningsTypeId
                )
                    return false;

                if (groups.some(g => g === "Company") && d.companyId !== data.companyId) return false;

                return true;
            };

            let row: GroupTableRecord = {
                key: key,
                sortKey: sortKey,
                earningsTypeGroupKey: earningsTypeGroupKey,
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: data.policyTypeId,
                commissionEarningsTypeId: data.commissionEarningsTypeId,
                companyId: data.companyId,
            };
            row = getTableRow(row, pastMonthsCount, now, root.items, filter);

            rows.push(row);
        });

        rows = rows.sort((a, b) => {
            if (a.sortKey > b.sortKey) return 1;
            else if (a.sortKey < b.sortKey) return -1;

            return 0;
        });

        //Calculate Policy Type Row Span ---------------------------------------------------
        let policyTypeIds = [...new Set(rows.map(i => i.policyTypeId))];

        policyTypeIds.forEach(policyTypeId => {
            let index = 0;
            const count = rows.filter(r => r.policyTypeId === policyTypeId).length;

            rows.forEach((r, i) => {
                if (r.policyTypeId !== policyTypeId || count === 1) return;

                rows[i].policyTypeRowSpan = index === 0 ? count : 0;

                index = index + 1;
            });
        });
        //------------------------------------------------------------------------------------

        //Calculate Earnings Type Row Span ---------------------------------------------------
        let earningsTypeGroupKeys = [...new Set(rows.map(i => i.earningsTypeGroupKey))];

        earningsTypeGroupKeys.forEach(earningsTypeGroupKey => {
            let index = 0;
            const count = rows.filter(r => r.earningsTypeGroupKey === earningsTypeGroupKey).length;

            rows.forEach((r, i) => {
                if (r.earningsTypeGroupKey !== earningsTypeGroupKey || count === 1) return;

                rows[i].earningsTypeRowSpan = index === 0 ? count : 0;

                index = index + 1;
            });
        });
        //------------------------------------------------------------------------------------

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
        const current = moment(now).subtract(monthsBack, "months");

        const key = current.format(DATE_FORMAT);

        const year = current.year();
        const month = current.month() + 1;

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
        const current = moment(now).subtract(monthsBack, "months");

        const key = current.format(DATE_FORMAT);
        const title = monthsBack === 0 ? "Current" : current.format("MMM");

        const column = getColumn(
            key,
            title,
            {
                type: "currency",
            },
            {
                sorter: false,
            }
        );

        columns.push(column);

        monthsBack = monthsBack - 1;
    }

    return columns;
};

const getPolicyTypeName = (policyTypeId: string | null, types: PolicyType[]): string => {
    let name = "Unknown";
    const type = types.find(c => c.id === policyTypeId);
    if (type) name = type.name;
    return name;
};

const getEarningsTypeName = (commissionEarningsTypeId: string, types: CommissionEarningsType[]): string => {
    const type = types.find(c => c.id === commissionEarningsTypeId);
    if (!type) return "";
    return type.name;
};

const getCompanyName = (companyId: string, companies: Company[]): string => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return "";
    return company.name;
};
