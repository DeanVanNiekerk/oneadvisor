import moment from "moment";

import { DATE_FORMAT } from "@/app/utils";
import { State as PolicyTypesState } from "@/state/app/client/lookups/policyTypes/list/reducer";
import { State as CompaniesState } from "@/state/app/directory/lookups/companies/list/reducer";

import { Group, GroupTableRecord, PastRevenueCommissionData } from "../";
import {
    ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
    LIFE_FIRST_YEARS_COMMISSION_EARNINGS_TYPE_ID,
    MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
} from "../../lookups";
import { State as CommissionEarningsTypeState } from "../../lookups/commissionEarningsTypes/list/reducer";
import { State as ProjectionsState } from "./reducer";
import { projectionGroupTableRowsSelector } from "./selectors";

/*
    These tests require for the

        //import { getColumnSearchProps } from "@/ui/controls";

    line to be commented out in @/app/table/utils, some issue with antd and jest

    Can check if the issue has been resolved here: https://github.com/facebook/jest/issues/7957
*/

it("mock", () => {
    expect(true).toBe(true);
});
/*
describe("report commission projects selectors", () => {

    describe("projectionGroupTableRowsSelector", () => {

        const now = moment("2019-08-22");

        const companyId1 = "company1";
        const companyId2 = "company2";

        const policyTypeId1 = "policyType1";
        const policyTypeId2 = "policyType2";

        const projectionsState: ProjectionsState = {
            items: [] as PastRevenueCommissionData[],
            groups: [] as Group[],
            fetching: false,
            filters: {},
            monthsBack: 3,
            monthsForward: 3
        }

        const commissionEarningsTypeState: CommissionEarningsTypeState = {
            items: [
                {
                    id: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    name: "Monthly Annuity"
                },
                {
                    id: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    name: "Annual Annuity"
                }
            ],
        };

        const policyTypesState: PolicyTypesState = {
            items: [
                {
                    id: policyTypeId1,
                    name: "Policy Type 1",
                    code: "code 1"
                },
                {
                    id: policyTypeId2,
                    name: "Policy Type 2",
                    code: "code 2"
                }
            ],
        };

        const companiesState: CompaniesState = {
            fetching: false,
            items: [
                {
                    id: companyId1,
                    name: "Company 1",
                    commissionPolicyNumberPrefixes: []
                },
                {
                    id: companyId2,
                    name: "Company 2",
                    commissionPolicyNumberPrefixes: []
                }
            ]
        };

        it("no items - only total record", () => {

            const state = { ...projectionsState };

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(state, commissionEarningsTypeState, policyTypesState, companiesState, now.toDate());

            const expected: GroupTableRecord[] = [
                {
                    key: '',
                    sortKey: '',
                    earningsTypeGroupKey: '',
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    companyColSpan: 1,
                    isTotalRow: true,
                    '2019-05-22': 0,
                    '2019-06-22': 0,
                    '2019-07-22': 0,
                    '2019-08-22': 0,
                    '2019-09-22': 0,
                    '2019-10-22': 0,
                    '2019-11-22': 0,
                }
            ];

            expect(actual).toEqual(expected);
        });

        it("has items - no groups - only total record", () => {

            const lastMonth = now.clone().subtract(1, "month");
            const twoMonthsAgo = now.clone().subtract(2, "month");
            const threeMonthsAgo = now.clone().subtract(3, "month");

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 50
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 90
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: threeMonthsAgo.year(),
                    dateMonth: threeMonthsAgo.month() + 1,
                    amountExcludingVAT: 80
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: LIFE_FIRST_YEARS_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: twoMonthsAgo.year(),
                    dateMonth: twoMonthsAgo.month() + 1,
                    amountExcludingVAT: 60
                }
            ];

            const state = { ...projectionsState };
            state.monthsForward = 12;
            state.items = items;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(state, commissionEarningsTypeState, policyTypesState, companiesState, now.toDate());

            const expected: GroupTableRecord[] = [
                {
                    key: '',
                    sortKey: '',
                    earningsTypeGroupKey: '',
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    companyColSpan: 1,
                    isTotalRow: true,
                    '2019-05-22': 80, //80 - AA
                    '2019-06-22': 60, //60 - LFY
                    '2019-07-22': 190, //100 + 90 (MA + AA)
                    '2019-08-22': 50, //50 - MA
                    '2019-09-22': 100,
                    '2019-10-22': 100,
                    '2019-11-22': 100,
                    '2019-12-22': 100,
                    '2020-01-22': 100,
                    '2020-02-22': 100,
                    '2020-03-22': 100,
                    '2020-04-22': 100,
                    '2020-05-22': 180, //100 + 80 (MA + AA)
                    '2020-06-22': 120, //100 + 20 - (MA + LFY)
                    '2020-07-22': 190, //100 + 90 (MA + AA)
                    '2020-08-22': 100,
                }
            ];

            expect(actual).toEqual(expected);
        });

        it("group by policy type", () => {

            const lastMonth = now.clone().subtract(1, "month");

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 200
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 300
                }
            ];

            const groups: Group[] = ["Policy Type"];

            const state = { ...projectionsState };
            state.items = items;
            state.groups = groups;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(state, commissionEarningsTypeState, policyTypesState, companiesState, now.toDate());

            const expected: GroupTableRecord[] = [{
                key: '',
                sortKey: '',
                earningsTypeGroupKey: '',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 0,
                policyTypeColSpan: 1,
                companyColSpan: 0,
                isTotalRow: true,
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 600,
                '2019-08-22': 0,
                '2019-09-22': 600,
                '2019-10-22': 600,
                '2019-11-22': 600
            },
            {
                key: 'policyType1',
                sortKey: 'Policy Type 1',
                earningsTypeGroupKey: 'policyType1',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 400,
                '2019-08-22': 0,
                '2019-09-22': 400,
                '2019-10-22': 400,
                '2019-11-22': 400
            },
            {
                key: 'policyType2',
                sortKey: 'Policy Type 2',
                earningsTypeGroupKey: 'policyType2',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 200,
                '2019-08-22': 0,
                '2019-09-22': 200,
                '2019-10-22': 200,
                '2019-11-22': 200
            }];

            expect(actual).toEqual(expected);
        });

        it("group by policy type and earnings type", () => {

            const lastMonth = now.clone().subtract(1, "month");

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 200
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 300
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 400
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 500
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 600
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 700
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 800
                },
            ];

            const groups: Group[] = ["Policy Type", "Earnings Type"];

            const state = { ...projectionsState };
            state.items = items;
            state.groups = groups;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(state, commissionEarningsTypeState, policyTypesState, companiesState, now.toDate());

            const expected: GroupTableRecord[] = [{
                key: '',
                sortKey: '',
                earningsTypeGroupKey: '',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 0,
                policyTypeColSpan: 2,
                companyColSpan: 0,
                isTotalRow: true,
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 3600,
                '2019-08-22': 0,
                '2019-09-22': 1600,
                '2019-10-22': 1600,
                '2019-11-22': 1600
            },
            {
                key: 'policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951',
                sortKey: 'Policy Type 1Annual Annuity',
                earningsTypeGroupKey: 'policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 2,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: 'e8799015-6f4a-5d45-5be9-0fcd516e0951',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 600,
                '2019-08-22': 0,
                '2019-09-22': 0,
                '2019-10-22': 0,
                '2019-11-22': 0
            },
            {
                key: 'policyType18b42edc0-fac6-e946-c779-9d90a805c294',
                sortKey: 'Policy Type 1Monthly Annuity',
                earningsTypeGroupKey: 'policyType18b42edc0-fac6-e946-c779-9d90a805c294',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 400,
                '2019-08-22': 0,
                '2019-09-22': 400,
                '2019-10-22': 400,
                '2019-11-22': 400
            },
            {
                key: 'policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951',
                sortKey: 'Policy Type 2Annual Annuity',
                earningsTypeGroupKey: 'policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 2,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: 'e8799015-6f4a-5d45-5be9-0fcd516e0951',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 1400,
                '2019-08-22': 0,
                '2019-09-22': 0,
                '2019-10-22': 0,
                '2019-11-22': 0
            },
            {
                key: 'policyType28b42edc0-fac6-e946-c779-9d90a805c294',
                sortKey: 'Policy Type 2Monthly Annuity',
                earningsTypeGroupKey: 'policyType28b42edc0-fac6-e946-c779-9d90a805c294',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 1200,
                '2019-08-22': 0,
                '2019-09-22': 1200,
                '2019-10-22': 1200,
                '2019-11-22': 1200
            }];

            expect(actual).toEqual(expected);
        });

        it("group by policy type, earnings type and company", () => {

            const lastMonth = now.clone().subtract(1, "month");

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 200
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 300
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 400
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 500
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 600
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 700
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 800
                },
            ];

            const groups: Group[] = ["Policy Type", "Earnings Type", "Company"];

            const state = { ...projectionsState };
            state.items = items;
            state.groups = groups;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(state, commissionEarningsTypeState, policyTypesState, companiesState, now.toDate());

            const expected: GroupTableRecord[] = [{
                key: '',
                sortKey: '',
                earningsTypeGroupKey: '',
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 0,
                policyTypeColSpan: 3,
                companyColSpan: 0,
                isTotalRow: true,
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 3600,
                '2019-08-22': 0,
                '2019-09-22': 1600,
                '2019-10-22': 1600,
                '2019-11-22': 1600
            },
            {
                key: 'policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951company1',
                sortKey: 'Policy Type 1Annual AnnuityCompany 1',
                earningsTypeGroupKey: 'policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951',
                earningsTypeRowSpan: 2,
                policyTypeRowSpan: 4,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: 'e8799015-6f4a-5d45-5be9-0fcd516e0951',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 200,
                '2019-08-22': 0,
                '2019-09-22': 0,
                '2019-10-22': 0,
                '2019-11-22': 0
            },
            {
                key: 'policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951company2',
                sortKey: 'Policy Type 1Annual AnnuityCompany 2',
                earningsTypeGroupKey: 'policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951',
                earningsTypeRowSpan: 0,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: 'e8799015-6f4a-5d45-5be9-0fcd516e0951',
                companyId: 'company2',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 400,
                '2019-08-22': 0,
                '2019-09-22': 0,
                '2019-10-22': 0,
                '2019-11-22': 0
            },
            {
                key: 'policyType18b42edc0-fac6-e946-c779-9d90a805c294company1',
                sortKey: 'Policy Type 1Monthly AnnuityCompany 1',
                earningsTypeGroupKey: 'policyType18b42edc0-fac6-e946-c779-9d90a805c294',
                earningsTypeRowSpan: 2,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 100,
                '2019-08-22': 0,
                '2019-09-22': 100,
                '2019-10-22': 100,
                '2019-11-22': 100
            },
            {
                key: 'policyType18b42edc0-fac6-e946-c779-9d90a805c294company2',
                sortKey: 'Policy Type 1Monthly AnnuityCompany 2',
                earningsTypeGroupKey: 'policyType18b42edc0-fac6-e946-c779-9d90a805c294',
                earningsTypeRowSpan: 0,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType1',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company2',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 300,
                '2019-08-22': 0,
                '2019-09-22': 300,
                '2019-10-22': 300,
                '2019-11-22': 300
            },
            {
                key: 'policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951company1',
                sortKey: 'Policy Type 2Annual AnnuityCompany 1',
                earningsTypeGroupKey: 'policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951',
                earningsTypeRowSpan: 2,
                policyTypeRowSpan: 4,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: 'e8799015-6f4a-5d45-5be9-0fcd516e0951',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 600,
                '2019-08-22': 0,
                '2019-09-22': 0,
                '2019-10-22': 0,
                '2019-11-22': 0
            },
            {
                key: 'policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951company2',
                sortKey: 'Policy Type 2Annual AnnuityCompany 2',
                earningsTypeGroupKey: 'policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951',
                earningsTypeRowSpan: 0,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: 'e8799015-6f4a-5d45-5be9-0fcd516e0951',
                companyId: 'company2',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 800,
                '2019-08-22': 0,
                '2019-09-22': 0,
                '2019-10-22': 0,
                '2019-11-22': 0
            },
            {
                key: 'policyType28b42edc0-fac6-e946-c779-9d90a805c294company1',
                sortKey: 'Policy Type 2Monthly AnnuityCompany 1',
                earningsTypeGroupKey: 'policyType28b42edc0-fac6-e946-c779-9d90a805c294',
                earningsTypeRowSpan: 2,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 500,
                '2019-08-22': 0,
                '2019-09-22': 500,
                '2019-10-22': 500,
                '2019-11-22': 500
            },
            {
                key: 'policyType28b42edc0-fac6-e946-c779-9d90a805c294company2',
                sortKey: 'Policy Type 2Monthly AnnuityCompany 2',
                earningsTypeGroupKey: 'policyType28b42edc0-fac6-e946-c779-9d90a805c294',
                earningsTypeRowSpan: 0,
                policyTypeRowSpan: 0,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: 'policyType2',
                commissionEarningsTypeId: '8b42edc0-fac6-e946-c779-9d90a805c294',
                companyId: 'company2',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 700,
                '2019-08-22': 0,
                '2019-09-22': 700,
                '2019-10-22': 700,
                '2019-11-22': 700
            }];

            expect(actual).toEqual(expected);
        });

    });


});
*/
