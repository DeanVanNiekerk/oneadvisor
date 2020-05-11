import { Filters, SortOptions } from "@/app/table";

import { Statement } from "../";
import { defaultState, reducer } from "./reducer";

describe("statement list reducer", () => {
    it("should handle STATEMENTS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "STATEMENTS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const statement: Statement = {
            id: "10",
            companyId: "321",
            companyName: "Comp1",
            processed: false,
            notes: "note 1",
            amountIncludingVAT: 100,
            vat: 14,
            date: "2001-01-01",
            mappingErrorCount: 2,
            actualAmountIncludingVAT: 200,
            actualVAT: 16,
            commissionCount: 10,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_RECEIVE",
            payload: {
                totalItems: 1,
                sumAmountIncludingVAT: 2,
                sumVAT: 3,
                items: [statement],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [statement],
            totalItems: 1,
            sumAmountIncludingVAT: 2,
            sumVAT: 3,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_PAGE_OPTIONS_RECEIVE",
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

    it("should handle STATEMENTS_LIST_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_SORT_OPTIONS_RECEIVE",
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

    it("should handle STATEMENTS_LIST_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: Filters = {
            firstName: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_FILTERS_RECEIVE",
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

    it("should handle STATEMENTS_LIST_FILTERS_YEAR_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            filterYear: 2000,
        };

        const year = 2012;

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_FILTERS_YEAR_RECEIVE",
            payload: year,
        });

        const expectedState = {
            ...defaultState,
            filterYear: 2012,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_LIST_FILTERS_MONTH_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            filterMonth: 2,
        };

        const month = 12;

        const actualState = reducer(initalState, {
            type: "STATEMENTS_LIST_FILTERS_MONTH_RECEIVE",
            payload: month,
        });

        const expectedState = {
            ...defaultState,
            filterMonth: 12,
        };

        expect(actualState).toEqual(expectedState);
    });
});
