import { PageOptions, SortOptions } from "@/app/table/types";

import { defaultState, reducer } from "./reducer";
import { CommissionLapseData, CommissionLapseDataFilters } from "./types";

describe("report client revenue reducer", () => {
    it("should handle COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_COMMISSIONLAPSE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const data: CommissionLapseData = {
            companyId: "1111",
            policyTypeId: "2222",
            clientId: "3333",
            clientInitials: "4444",
            clientLastName: "5555",
            isActive: true,
            number: "66666",
            policyId: "77777",
            premium: 100,
            startDate: "888888",
            userId: "99999",
            companyName: "c1",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_RECEIVE",
            payload: {
                totalItems: 1,
                items: [data],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [data],
            totalItems: 1,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: CommissionLapseDataFilters = {
            userId: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE",
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

    it("should handle COMMISSIONS_REPORT_COMMISSIONLAPSE_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: PageOptions = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_PAGE_OPTIONS_RECEIVE",
            payload: options,
        });

        const expectedState = {
            ...defaultState,
            pageOptions: {
                ...options,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_COMMISSIONLAPSE_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_SORT_OPTIONS_RECEIVE",
            payload: options,
        });

        const expectedState = {
            ...defaultState,
            sortOptions: {
                ...options,
            },
        };

        expect(actualState).toEqual(expectedState);
    });
});
