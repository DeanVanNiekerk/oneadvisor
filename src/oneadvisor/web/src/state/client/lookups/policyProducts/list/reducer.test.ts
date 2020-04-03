import { defaultState, reducer } from "./reducer";

describe("policyProduct list reducer", () => {
    it("should handle POLICYPRODUCTS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYPRODUCTS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const policyProduct = {
            id: "10",
            policyProductTypeId: "123",
            companyId: "321",
            name: "Type 1",
            code: "type_1",
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTS_LIST_RECEIVE",
            payload: [policyProduct],
        });

        const expectedState = {
            ...defaultState,
            items: [policyProduct],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
