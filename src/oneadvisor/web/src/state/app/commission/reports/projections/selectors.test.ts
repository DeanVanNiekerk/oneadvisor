import moment from "moment";

import { State as PolicyTypesState } from "@/state/app/client/lookups/policyTypes/list/reducer";
import { ListState as CompaniesState } from "@/state/directory/lookups/companies";

import { Group, GroupTableRecord, PastRevenueCommissionData } from "../";
import {
    ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
    LIFE_FIRST_YEARS_COMMISSION_EARNINGS_TYPE_ID,
    MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
} from "../../lookups";
import { State as CommissionEarningsTypeState } from "../../lookups/commissionEarningsTypes/list/reducer";
import { State as ProjectionsState } from "./reducer";
import { projectionGroupTableRowsSelector } from "./selectors";

describe("report commission projects selectors", () => {
    describe("projectionGroupTableRowsSelector", () => {
        const now = moment("2019-08-01");

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
            monthsForward: 3,
        };

        const commissionEarningsTypeState: CommissionEarningsTypeState = {
            items: [
                {
                    id: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    name: "Monthly Annuity",
                },
                {
                    id: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    name: "Annual Annuity",
                },
            ],
        };

        const policyTypesState: PolicyTypesState = {
            items: [
                {
                    id: policyTypeId1,
                    name: "Policy Type 1",
                    code: "code 1",
                },
                {
                    id: policyTypeId2,
                    name: "Policy Type 2",
                    code: "code 2",
                },
            ],
        };

        const companiesState: CompaniesState = {
            fetching: false,
            items: [
                {
                    id: companyId1,
                    name: "Company 1",
                    commissionPolicyNumberPrefixes: [],
                },
                {
                    id: companyId2,
                    name: "Company 2",
                    commissionPolicyNumberPrefixes: [],
                },
            ],
        };

        it("no items - only total record", () => {
            const state = { ...projectionsState };

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(
                state,
                commissionEarningsTypeState,
                policyTypesState,
                companiesState,
                now.toDate()
            );

            const expected: GroupTableRecord[] = [
                {
                    key: "",
                    sortKey: "",
                    earningsTypeGroupKey: "",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    companyColSpan: 1,
                    isTotalRow: true,
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 0,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
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
                    amountExcludingVAT: 100,
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: now.year(),
                    dateMonth: now.month() + 1,
                    amountExcludingVAT: 50,
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 90,
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: threeMonthsAgo.year(),
                    dateMonth: threeMonthsAgo.month() + 1,
                    amountExcludingVAT: 80,
                },
                {
                    policyTypeId: null,
                    commissionEarningsTypeId: LIFE_FIRST_YEARS_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: twoMonthsAgo.year(),
                    dateMonth: twoMonthsAgo.month() + 1,
                    amountExcludingVAT: 60,
                },
            ];

            const state = { ...projectionsState };
            state.monthsForward = 12;
            state.items = items;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(
                state,
                commissionEarningsTypeState,
                policyTypesState,
                companiesState,
                now.toDate()
            );

            const expected: GroupTableRecord[] = [
                {
                    key: "",
                    sortKey: "",
                    earningsTypeGroupKey: "",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    companyColSpan: 1,
                    isTotalRow: true,
                    "2019-05-01": 80, //80 - AA
                    "2019-06-01": 60, //60 - LFY
                    "2019-07-01": 190, //100 + 90 (MA + AA)
                    "2019-08-01": 50, //50 - MA
                    "2019-09-01": 100,
                    "2019-10-01": 100,
                    "2019-11-01": 100,
                    "2019-12-01": 100,
                    "2020-01-01": 100,
                    "2020-02-01": 100,
                    "2020-03-01": 100,
                    "2020-04-01": 100,
                    "2020-05-01": 180, //100 + 80 (MA + AA)
                    "2020-06-01": 120, //100 + 20 - (MA + LFY)
                    "2020-07-01": 190, //100 + 90 (MA + AA)
                    "2020-08-01": 100,
                },
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
                    amountExcludingVAT: 100,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 200,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 300,
                },
            ];

            const groups: Group[] = ["Policy Type"];

            const state = { ...projectionsState };
            state.items = items;
            state.groups = groups;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(
                state,
                commissionEarningsTypeState,
                policyTypesState,
                companiesState,
                now.toDate()
            );

            const expected: GroupTableRecord[] = [
                {
                    key: "",
                    sortKey: "",
                    earningsTypeGroupKey: "",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 0,
                    policyTypeColSpan: 1,
                    companyColSpan: 0,
                    isTotalRow: true,
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 600,
                    "2019-08-01": 0,
                    "2019-09-01": 600,
                    "2019-10-01": 600,
                    "2019-11-01": 600,
                },
                {
                    key: "policyType1",
                    sortKey: "Policy Type 1",
                    earningsTypeGroupKey: "policyType1",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 400,
                    "2019-08-01": 0,
                    "2019-09-01": 400,
                    "2019-10-01": 400,
                    "2019-11-01": 400,
                },
                {
                    key: "policyType2",
                    sortKey: "Policy Type 2",
                    earningsTypeGroupKey: "policyType2",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 200,
                    "2019-08-01": 0,
                    "2019-09-01": 200,
                    "2019-10-01": 200,
                    "2019-11-01": 200,
                },
            ];

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
                    amountExcludingVAT: 100,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 200,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 300,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 400,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 500,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 600,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 700,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 800,
                },
            ];

            const groups: Group[] = ["Policy Type", "Earnings Type"];

            const state = { ...projectionsState };
            state.items = items;
            state.groups = groups;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(
                state,
                commissionEarningsTypeState,
                policyTypesState,
                companiesState,
                now.toDate()
            );

            const expected: GroupTableRecord[] = [
                {
                    key: "",
                    sortKey: "",
                    earningsTypeGroupKey: "",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 0,
                    policyTypeColSpan: 2,
                    companyColSpan: 0,
                    isTotalRow: true,
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 3600,
                    "2019-08-01": 0,
                    "2019-09-01": 1600,
                    "2019-10-01": 1600,
                    "2019-11-01": 1600,
                },
                {
                    key: "policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    sortKey: "Policy Type 1Annual Annuity",
                    earningsTypeGroupKey: "policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 2,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 600,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
                {
                    key: "policyType18b42edc0-fac6-e946-c779-9d90a805c294",
                    sortKey: "Policy Type 1Monthly Annuity",
                    earningsTypeGroupKey: "policyType18b42edc0-fac6-e946-c779-9d90a805c294",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 400,
                    "2019-08-01": 0,
                    "2019-09-01": 400,
                    "2019-10-01": 400,
                    "2019-11-01": 400,
                },
                {
                    key: "policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    sortKey: "Policy Type 2Annual Annuity",
                    earningsTypeGroupKey: "policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 2,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 1400,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
                {
                    key: "policyType28b42edc0-fac6-e946-c779-9d90a805c294",
                    sortKey: "Policy Type 2Monthly Annuity",
                    earningsTypeGroupKey: "policyType28b42edc0-fac6-e946-c779-9d90a805c294",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 1200,
                    "2019-08-01": 0,
                    "2019-09-01": 1200,
                    "2019-10-01": 1200,
                    "2019-11-01": 1200,
                },
            ];

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
                    amountExcludingVAT: 100,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 200,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 300,
                },
                {
                    policyTypeId: policyTypeId1,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 400,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 500,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId1,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 600,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: MONTHLY_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 700,
                },
                {
                    policyTypeId: policyTypeId2,
                    commissionEarningsTypeId: ANNUAL_ANNUITY_COMMISSION_EARNINGS_TYPE_ID,
                    companyId: companyId2,
                    dateYear: lastMonth.year(),
                    dateMonth: lastMonth.month() + 1,
                    amountExcludingVAT: 800,
                },
            ];

            const groups: Group[] = ["Policy Type", "Earnings Type", "Company"];

            const state = { ...projectionsState };
            state.items = items;
            state.groups = groups;

            //@ts-ignore
            const actual = projectionGroupTableRowsSelector.resultFunc(
                state,
                commissionEarningsTypeState,
                policyTypesState,
                companiesState,
                now.toDate()
            );

            const expected: GroupTableRecord[] = [
                {
                    key: "",
                    sortKey: "",
                    earningsTypeGroupKey: "",
                    earningsTypeRowSpan: 1,
                    policyTypeRowSpan: 1,
                    earningsTypeColSpan: 0,
                    policyTypeColSpan: 3,
                    companyColSpan: 0,
                    isTotalRow: true,
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 3600,
                    "2019-08-01": 0,
                    "2019-09-01": 1600,
                    "2019-10-01": 1600,
                    "2019-11-01": 1600,
                },
                {
                    key: "policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951company1",
                    sortKey: "Policy Type 1Annual AnnuityCompany 1",
                    earningsTypeGroupKey: "policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    earningsTypeRowSpan: 2,
                    policyTypeRowSpan: 4,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 200,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
                {
                    key: "policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951company2",
                    sortKey: "Policy Type 1Annual AnnuityCompany 2",
                    earningsTypeGroupKey: "policyType1e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    earningsTypeRowSpan: 0,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    companyId: "company2",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 400,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
                {
                    key: "policyType18b42edc0-fac6-e946-c779-9d90a805c294company1",
                    sortKey: "Policy Type 1Monthly AnnuityCompany 1",
                    earningsTypeGroupKey: "policyType18b42edc0-fac6-e946-c779-9d90a805c294",
                    earningsTypeRowSpan: 2,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 100,
                    "2019-08-01": 0,
                    "2019-09-01": 100,
                    "2019-10-01": 100,
                    "2019-11-01": 100,
                },
                {
                    key: "policyType18b42edc0-fac6-e946-c779-9d90a805c294company2",
                    sortKey: "Policy Type 1Monthly AnnuityCompany 2",
                    earningsTypeGroupKey: "policyType18b42edc0-fac6-e946-c779-9d90a805c294",
                    earningsTypeRowSpan: 0,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType1",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company2",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 300,
                    "2019-08-01": 0,
                    "2019-09-01": 300,
                    "2019-10-01": 300,
                    "2019-11-01": 300,
                },
                {
                    key: "policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951company1",
                    sortKey: "Policy Type 2Annual AnnuityCompany 1",
                    earningsTypeGroupKey: "policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    earningsTypeRowSpan: 2,
                    policyTypeRowSpan: 4,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 600,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
                {
                    key: "policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951company2",
                    sortKey: "Policy Type 2Annual AnnuityCompany 2",
                    earningsTypeGroupKey: "policyType2e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    earningsTypeRowSpan: 0,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "e8799015-6f4a-5d45-5be9-0fcd516e0951",
                    companyId: "company2",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 800,
                    "2019-08-01": 0,
                    "2019-09-01": 0,
                    "2019-10-01": 0,
                    "2019-11-01": 0,
                },
                {
                    key: "policyType28b42edc0-fac6-e946-c779-9d90a805c294company1",
                    sortKey: "Policy Type 2Monthly AnnuityCompany 1",
                    earningsTypeGroupKey: "policyType28b42edc0-fac6-e946-c779-9d90a805c294",
                    earningsTypeRowSpan: 2,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company1",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 500,
                    "2019-08-01": 0,
                    "2019-09-01": 500,
                    "2019-10-01": 500,
                    "2019-11-01": 500,
                },
                {
                    key: "policyType28b42edc0-fac6-e946-c779-9d90a805c294company2",
                    sortKey: "Policy Type 2Monthly AnnuityCompany 2",
                    earningsTypeGroupKey: "policyType28b42edc0-fac6-e946-c779-9d90a805c294",
                    earningsTypeRowSpan: 0,
                    policyTypeRowSpan: 0,
                    earningsTypeColSpan: 1,
                    policyTypeColSpan: 1,
                    policyTypeId: "policyType2",
                    commissionEarningsTypeId: "8b42edc0-fac6-e946-c779-9d90a805c294",
                    companyId: "company2",
                    "2019-05-01": 0,
                    "2019-06-01": 0,
                    "2019-07-01": 700,
                    "2019-08-01": 0,
                    "2019-09-01": 700,
                    "2019-10-01": 700,
                    "2019-11-01": 700,
                },
            ];

            expect(actual).toEqual(expected);
        });
    });
});
