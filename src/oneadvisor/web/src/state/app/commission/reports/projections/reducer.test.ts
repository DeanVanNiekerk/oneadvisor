import { defaultState, reducer } from "./reducer";
import { Group, PastRevenueCommissionData, PastRevenueCommissionDataFilters } from "./types";

describe("report client revenue reducer", () => {
    it("should handle COMMISSIONS_REPORT_PROJECTIONS_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_REPORT_PROJECTIONS_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_PROJECTIONS_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_PROJECTIONS_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_PROJECTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const data: PastRevenueCommissionData = {
            companyId: "1111",
            policyTypeId: "2222",
            commissionEarningsTypeId: "3333",
            dateYear: 1999,
            dateMonth: 10,
            amountExcludingVAT: 10,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_PROJECTIONS_RECEIVE",
            payload: [data],
        });

        const expectedState = {
            ...defaultState,
            items: [data],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: PastRevenueCommissionDataFilters = {
            userId: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE",
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

    it("should handle COMMISSIONS_REPORT_PROJECTIONS_GROUPS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const groups: Group[] = ["Policy Type"];

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_PROJECTIONS_GROUPS_RECEIVE",
            payload: groups,
        });

        const expectedState = {
            ...defaultState,
            groups: [...groups],
        };

        expect(actualState).toEqual(expectedState);
    });
});
