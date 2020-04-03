import { getValidationResult } from "@/test";

import { defaultState, reducer } from "./reducer";

describe("branch reducer", () => {
    it("should handle BRANCHES_BRANCH_FETCHING", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_BRANCH_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_BRANCH_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_BRANCH_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_BRANCH_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const branch = {
            id: "10",
            organisationId: "99",
            name: "Org1",
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_BRANCH_RECEIVE",
            payload: { ...branch },
        });

        const expectedState = {
            ...defaultState,
            branch: { ...branch },
            branchOriginal: { ...branch },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_BRANCH_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "BRANCHES_BRANCH_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_BRANCH_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_BRANCH_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_BRANCH_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_BRANCH_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
