import { Filters, SortOptions } from "@/app/table";

import { defaultState, reducer } from "./reducer";
import { UserEarningsTypeMonthlyCommissionData, UserEarningsTypeMonthlyCommissionFilters } from "./types";

describe("report user monthly commission reducer", () => {
    it("should handle COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const data: UserEarningsTypeMonthlyCommissionData = {
            amountExcludingVAT: 40,
            commissionEarningsTypeId: "987987",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_RECEIVE",
            payload: [data],
        });

        const expectedState = {
            ...defaultState,
            items: [data],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: UserEarningsTypeMonthlyCommissionFilters = {
            userId: ["1"],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE",
            payload: filters,
        });

        const expectedState = {
            ...defaultState,
            filters: {
                ...filters,
            },
        };

        expect(actualState).toEqual(expectedState);
    });
});
