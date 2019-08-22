import moment from "moment";

import { DATE_FORMAT } from "@/app/utils";
import { State as PolicyTypesState } from "@/state/app/client/lookups/policyTypes/list/reducer";
import { State as CompaniesState } from "@/state/app/directory/lookups/companies/list/reducer";

import { Group, GroupTableRecord, PastRevenueCommissionData } from "../";
import { ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID, MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID } from "../../lookups";
import { State as CommissionEarningsTypeState } from "../../lookups/commissionEarningsTypes/list/reducer";
import { State as ProjectionsState } from "./reducer";
import { projectionGroupTableRowsSelector } from "./selectors";

/*
    These tests require for the

        //import { getColumnSearchProps } from "@/ui/controls";

    line to be commented out in @/app/table/utils, some issue with antd and jest

    Can check if the issue has been resolved here: https://github.com/facebook/jest/issues/7957
*/

it("mock", () => { expect(true).toBe(true); })
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
            filters: {
                startDate: [now.clone().subtract(3, "months").format(DATE_FORMAT)]
            },
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
                    '2019-08-22': 0
                }
            ];

            expect(actual).toEqual(expected);
        });

        it("has items - no groups - only total record", () => {

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: "comp_1",
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 100
                }
            ];

            const state = { ...projectionsState };
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
                    '2019-05-22': 0,
                    '2019-06-22': 0,
                    '2019-07-22': 0,
                    '2019-08-22': 100
                }
            ];

            expect(actual).toEqual(expected);
        });

        it("group by policy type", () => {

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 200
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
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
                '2019-07-22': 0,
                '2019-08-22': 600
            },
            {
                key: policyTypeId1,
                sortKey: 'Policy Type 1',
                earningsTypeGroupKey: policyTypeId1,
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: policyTypeId1,
                commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 0,
                '2019-08-22': 400
            },
            {
                key: policyTypeId2,
                sortKey: 'Policy Type 2',
                earningsTypeGroupKey: policyTypeId2,
                earningsTypeRowSpan: 1,
                policyTypeRowSpan: 1,
                earningsTypeColSpan: 1,
                policyTypeColSpan: 1,
                policyTypeId: policyTypeId2,
                commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                companyId: 'company1',
                '2019-05-22': 0,
                '2019-06-22': 0,
                '2019-07-22': 0,
                '2019-08-22': 200
            }];

            expect(actual).toEqual(expected);
        });

        it("group by policy type and earnings type", () => {

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 200
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 300
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 400
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 500
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 600
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 700
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
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
                '2019-07-22': 0,
                '2019-08-22': 3600
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
                '2019-07-22': 0,
                '2019-08-22': 600
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
                '2019-07-22': 0,
                '2019-08-22': 400
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
                '2019-07-22': 0,
                '2019-08-22': 1400
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
                '2019-07-22': 0,
                '2019-08-22': 1200
            }];

            expect(actual).toEqual(expected);
        });

        it("group by policy type, earnings type and company", () => {

            const items: PastRevenueCommissionData[] = [
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 100
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 200
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 300
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 400
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 500
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 600
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 700
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
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
                '2019-07-22': 0,
                '2019-08-22': 3600
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
                '2019-07-22': 0,
                '2019-08-22': 200
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
                '2019-07-22': 0,
                '2019-08-22': 400
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
                '2019-07-22': 0,
                '2019-08-22': 100
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
                '2019-07-22': 0,
                '2019-08-22': 300
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
                '2019-07-22': 0,
                '2019-08-22': 600
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
                '2019-07-22': 0,
                '2019-08-22': 800
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
                '2019-07-22': 0,
                '2019-08-22': 500
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
                '2019-07-22': 0,
                '2019-08-22': 700
            }];

            expect(actual).toEqual(expected);
        });

    });


});
*/