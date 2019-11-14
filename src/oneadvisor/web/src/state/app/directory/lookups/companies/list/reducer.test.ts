import { defaultState, reducer } from "./reducer";

describe("company list reducer", () => {
    it("should handle COMPANIES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMPANIES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMPANIES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const company = {
            id: "10",
            name: "Org1",
            commissionPolicyNumberPrefixes: ["pre_1"],
        };

        const actualState = reducer(initalState, {
            type: "COMPANIES_LIST_RECEIVE",
            payload: [company],
        });

        const expectedState = {
            ...defaultState,
            items: [company],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
