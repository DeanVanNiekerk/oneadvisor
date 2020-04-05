import { AdviceScope } from "../types";
import { defaultState, reducer } from "./reducer";

describe("adviceScope list reducer", () => {
    it("should handle ADVICESCOPES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ADVICESCOPES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESCOPES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const adviceScope: AdviceScope = {
            id: "10",
            name: "n1",
        };

        const actualState = reducer(initalState, {
            type: "ADVICESCOPES_LIST_RECEIVE",
            payload: [adviceScope],
        });

        const expectedState = {
            ...defaultState,
            items: [adviceScope],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
