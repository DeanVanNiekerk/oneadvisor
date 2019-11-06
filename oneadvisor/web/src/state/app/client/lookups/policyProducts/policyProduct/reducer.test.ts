import { getValidationResult } from "@/test";

import { defaultState, reducer } from "./reducer";

describe("policyProduct reducer", () => {
    it("should handle POLICYPRODUCTS_POLICYPRODUCT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const policyProduct = {
            id: "10",
            policyProductTypeId: "123",
            companyId: "321",
            name: "Type 1",
            code: "type_1",
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTS_POLICYPRODUCT_RECEIVE",
            payload: { ...policyProduct },
        });

        const expectedState = {
            ...defaultState,
            policyProduct: { ...policyProduct },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTS_POLICYPRODUCT_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTS_POLICYPRODUCT_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
