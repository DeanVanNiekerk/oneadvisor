import { Filters, SortOptions } from '@/app/table';

import { SplitRulePolicyInfo } from '../';
import { defaultState, reducer } from './reducer';

describe("splitRulePolicy list reducer", () => {
    it("should handle SPLITRULEPOLICIES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "SPLITRULEPOLICIES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const splitRulePolicy: SplitRulePolicyInfo = {
            policyId: "10",
            policyCompanyId: "12",
            policyNumber: "13",
            policyUserId: "14",
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_LIST_RECEIVE",
            payload: {
                items: [splitRulePolicy],
                totalItems: 1,
            },
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [splitRulePolicy],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_LIST_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_LIST_PAGE_OPTIONS_RECEIVE",
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

    it("should handle SPLITRULEPOLICIES_LIST_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_LIST_SORT_OPTIONS_RECEIVE",
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

    it("should handle SPLITRULEPOLICIES_LIST_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: Filters = {
            firstName: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_LIST_FILTERS_RECEIVE",
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
