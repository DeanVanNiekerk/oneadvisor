import { defaultState, reducer } from "./reducer";

describe("branch list reducer", () => {
    it("should handle BRANCHES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "BRANCHES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const branch = {
            id: "10",
            organisationId: "99",
            name: "Org1",
        };

        const actualState = reducer(initalState, {
            type: "BRANCHES_LIST_RECEIVE",
            payload: {
                items: [branch],
                totalItems: 1,
            },
        });

        const expectedState = {
            ...defaultState,
            items: [branch],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
