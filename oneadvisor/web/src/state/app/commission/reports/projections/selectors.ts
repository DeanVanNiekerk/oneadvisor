import { ColumnProps } from "antd/lib/table";
import moment from "moment";
import { createSelector } from "reselect";

import { getColumnDefinition } from "@/app/table";
import { DATE_FORMAT } from "@/app/utils";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import { State as PolicyTypesState } from "@/state/app/client/lookups/policyTypes/list/reducer";
import { companiesSelector, Company } from "@/state/app/directory/lookups";
import { State as CompaniesState } from "@/state/app/directory/lookups/companies/list/reducer";
import { RootState } from "@/state/rootReducer";

import { Group, GroupTableRecord, PastRevenueCommissionData } from "../";
import {
    ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID, CommissionEarningsType, commissionEarningsTypesSelector,
    MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID
} from "../../lookups";
import { State as CommissionEarningsTypesState } from "../../lookups/commissionEarningsTypes/list/reducer";
import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.reports.projections;

export const commissionProjectionsSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

const todaySelector: (state: RootState) => Date = createSelector(
    rootSelector,
    () => new Date()
);

export const projectionGroupsTableColumnsSelector: (state: RootState) => ColumnProps<any>[] = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    policyTypesSelector,
    companiesSelector,
    (
        root: State,
        commissionEarningsTypesState: CommissionEarningsTypesState,
        policyTypesState: PolicyTypesState,
        companies: CompaniesState
    ) => {
        const { groups, monthsBack, monthsForward } = root;

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
                            let value = getCompanyName(companyId, companies.items);
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

        return columns.concat(getMonthColumns(monthsBack, monthsForward));
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

export const projectionGroupTableRowsSelector: (state: RootState) => GroupTableRecord[] = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    policyTypesSelector,
    companiesSelector,
    todaySelector,
    (
        root: State,
        commissionEarningsTypesState: CommissionEarningsTypesState,
        policyTypesState: PolicyTypesState,
        companies: CompaniesState,
        now: Date,
    ) => {

        let { items } = root;
        const { groups, monthsBack, monthsForward } = root;

        items = appendProjectedValues(now, items);

        const monthsBackDate = moment().subtract(monthsBack, 'months').startOf("month");

        items = items.filter(d => moment(new Date(d.dateYear, d.dateMonth - 1, 1)).isSameOrAfter(monthsBackDate));

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
        totalRow = getTableRow(totalRow, monthsBack, monthsForward, now, items);
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
                sortKey = sortKey.concat(getCompanyName(data.companyId, companies.items));
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
            row = getTableRow(row, monthsBack, monthsForward, now, items, filter);

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
    monthsForward: number,
    now: Date,
    items: PastRevenueCommissionData[],
    filter?: TableRowFilter
) => {

    let monthIndex = 0;
    const current = moment(now).subtract(monthsBack, "months");

    while (monthsBack + monthsForward >= monthIndex) {

        const key = current.format(DATE_FORMAT);

        const year = current.year();
        const month = current.month() + 1;

        let filtered = items.filter(d => d.dateYear === year && d.dateMonth === month);

        if (filter) filtered = filtered.filter(filter);

        const value = filtered.reduce((p, c) => c.amountExcludingVAT + p, 0);

        row[key] = value;

        current.add(1, "months");
        monthIndex = monthIndex + 1;
    }

    return row;
};

const appendProjectedValues = (now: Date, items: PastRevenueCommissionData[]): PastRevenueCommissionData[] => {

    const itemsWithProjected = [...items];

    const lastMonth = moment(now).subtract(1, "months");

    //Add monthly annuity values
    const monthlyAnnuityItems = items.filter(i =>
        i.commissionEarningsTypeId === MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID
        && i.dateYear === lastMonth.year()
        && i.dateMonth === lastMonth.month() + 1
    );

    monthlyAnnuityItems.forEach(item => {

        let monthIndex = 1;
        while (monthIndex <= 12) {

            const current = moment(now).add(monthIndex, "months");

            itemsWithProjected.push({
                policyTypeId: item.policyTypeId,
                commissionEarningsTypeId: item.commissionEarningsTypeId,
                companyId: item.companyId,
                dateYear: current.year(),
                dateMonth: current.month() + 1,
                amountExcludingVAT: item.amountExcludingVAT,
            })
            monthIndex++;
        }
    });

    //Add annual annuity values
    const annualAnnuityItems = items.filter(i => i.commissionEarningsTypeId === ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID);

    annualAnnuityItems.forEach(item => {

        const current = moment(new Date(item.dateYear, item.dateMonth - 1, 1)).add(1, "year");

        itemsWithProjected.push({
            policyTypeId: item.policyTypeId,
            commissionEarningsTypeId: item.commissionEarningsTypeId,
            companyId: item.companyId,
            dateYear: current.year(),
            dateMonth: current.month() + 1,
            amountExcludingVAT: item.amountExcludingVAT,
        })
    });

    return itemsWithProjected;
}

const getMonthColumns = (monthsBack: number, monthsForward: number): ColumnProps<any>[] => {
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

    let monthIndex = 1;
    while (monthIndex <= monthsForward) {
        const current = moment(now).add(monthIndex, "months");

        const key = current.format(DATE_FORMAT);
        const title = current.format("MMM");

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

        monthIndex = monthIndex + 1;
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
