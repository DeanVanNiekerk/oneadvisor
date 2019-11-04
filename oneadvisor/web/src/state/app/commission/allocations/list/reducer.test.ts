import { defaultState, reducer } from "./reducer";

describe("allocation list reducer", () => {
    it("should handle ALLOCATIONS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ALLOCATIONS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const allocation = {
            id: "10",
            fromClientId: "12",
            toClientId: "13",
            policyIdCount: 14,
            fromClientFirstName: "FN1",
            fromClientLastName: "LN1",
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_LIST_RECEIVE",
            payload: {
                items: [allocation],
                totalItems: 1,
            },
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [allocation],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
