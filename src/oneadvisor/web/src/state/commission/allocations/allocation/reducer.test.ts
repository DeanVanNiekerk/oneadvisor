import { getValidationResult } from "@/test";

import { defaultState, reducer } from "./reducer";

describe("allocation reducer", () => {
    it("should handle ALLOCATIONS_ALLOCATION_FETCHING", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_ALLOCATION_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_ALLOCATION_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_ALLOCATION_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_ALLOCATION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const allocation = {
            id: "10",
            fromClientId: "12",
            toClientId: "13",
            policyIds: ["14"],
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_ALLOCATION_RECEIVE",
            payload: { ...allocation },
        });

        const expectedState = {
            ...defaultState,
            allocation: { ...allocation },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_ALLOCATION_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ALLOCATIONS_ALLOCATION_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_ALLOCATION_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_ALLOCATION_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ALLOCATIONS_ALLOCATION_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ALLOCATIONS_ALLOCATION_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
