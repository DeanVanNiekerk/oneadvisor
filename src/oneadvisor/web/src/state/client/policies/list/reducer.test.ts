import { Filters, SortOptions } from "@/app/table";

import { Policy } from "../types";
import { defaultState, reducer } from "./reducer";

describe("policy list reducer", () => {
    it("should handle POLICIES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICIES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICIES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICIES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const policy: Policy = {
            id: "10",
            clientId: "12",
            companyId: "100",
            userId: "1",
            number: "987654",
            premium: 500,
            startDate: "1999-01-01",
            policyTypeId: "123321",
            policyProductTypeId: "00111",
            policyProductId: "99988777",
            clientLastName: "Jones",
            clientInitials: "DJ",
            clientDateOfBirth: "1982-10-03",
            isActive: true,
            companyName: "c1",
            numberAliases: [],
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_LIST_RECEIVE",
            payload: {
                totalItems: 1,
                items: [policy],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [policy],
            totalItems: 1,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICIES_LIST_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_LIST_PAGE_OPTIONS_RECEIVE",
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

    it("should handle POLICIES_LIST_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_LIST_SORT_OPTIONS_RECEIVE",
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

    it("should handle POLICIES_LIST_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: Filters = {
            firstName: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_LIST_FILTERS_RECEIVE",
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

    it("should handle POLICIES_LIST_SELECTED_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const policies: Policy[] = [
            {
                id: "10",
                clientId: "12",
                companyId: "100",
                userId: "1",
                number: "987654",
                premium: 500,
                startDate: "1999-01-01",
                policyTypeId: "123321",
                policyProductTypeId: "00111",
                policyProductId: "99988777",
                clientLastName: "Jones",
                clientInitials: "DJ",
                clientDateOfBirth: "1982-10-03",
                isActive: true,
                companyName: "c1",
                numberAliases: [],
            },
        ];

        const actualState = reducer(initalState, {
            type: "POLICIES_LIST_SELECTED_RECEIVE",
            payload: policies,
        });

        const expectedState = {
            ...defaultState,
            selectedPolicies: policies,
        };

        expect(actualState).toEqual(expectedState);
    });
});
