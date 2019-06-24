import { getValidationResult } from '@/test';

import { defaultState, reducer } from './reducer';

describe("policyProductType reducer", () => {
    it("should handle POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const policyProductType = {
            id: "10",
            policyTypeId: "123",
            name: "Type 1",
            code: "type_1",
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_RECEIVE",
            payload: { ...policyProductType },
        });

        const expectedState = {
            ...defaultState,
            policyProductType: { ...policyProductType },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
