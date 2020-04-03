import { BranchSimple } from "../";
import { defaultState, reducer } from "./reducer";

describe("branch list reducer", () => {
    it("should handle BRANCHESSIMPLE_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "BRANCHESSIMPLE_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHESSIMPLE_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "BRANCHESSIMPLE_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle BRANCHESSIMPLE_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const branch: BranchSimple = {
            id: "10",
            name: "Dean",
        };

        const actualState = reducer(initalState, {
            type: "BRANCHESSIMPLE_LIST_RECEIVE",
            payload: [branch],
        });

        const expectedState = {
            ...defaultState,
            items: [branch],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
