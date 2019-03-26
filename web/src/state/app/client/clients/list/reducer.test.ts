import { Filters, SortOptions } from '@/app/table';

import { Client } from '../';
import { defaultState, reducer } from './reducer';

describe("client list reducer", () => {
    it("should handle CLIENTS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "CLIENTS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const client: Client = {
            id: "10",
            firstName: "Dean",
            lastName: "Jackson",
            maidenName: "",
            initials: "DJ",
            preferredName: "ripper",
            idNumber: "12341234",
            passportNumber: "987987",
            dateOfBirth: "1982-10-03",
            marriageDate: "1982-10-02",
            marritalStatusId: "987654",
            taxNumber: "AABB1212",
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_LIST_RECEIVE",
            payload: {
                totalItems: 1,
                items: [client],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [client],
            totalItems: 1,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_LIST_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_LIST_PAGE_OPTIONS_RECEIVE",
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

    it("should handle CLIENTS_LIST_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_LIST_SORT_OPTIONS_RECEIVE",
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

    it("should handle CLIENTS_LIST_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: Filters = {
            firstName: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_LIST_FILTERS_RECEIVE",
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

    it("should handle CLIENTS_LIST_SELECTED_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const clientIds: string[] = ["1", "2"];

        const actualState = reducer(initalState, {
            type: "CLIENTS_LIST_SELECTED_RECEIVE",
            payload: clientIds,
        });

        const expectedState = {
            ...defaultState,
            selectedClientIds: clientIds,
        };

        expect(actualState).toEqual(expectedState);
    });
});
