import { defaultState, reducer } from "./reducer";

describe("policyProductType list reducer", () => {
    it("should handle POLICYPRODUCTTYPES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYPRODUCTTYPES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTTYPES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTTYPES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTTYPES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const policyProductType = {
            id: "10",
            policyTypeId: "123",
            name: "Type 1",
            code: "type_1",
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTTYPES_LIST_RECEIVE",
            payload: [policyProductType],
        });

        const expectedState = {
            ...defaultState,
            items: [policyProductType],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
