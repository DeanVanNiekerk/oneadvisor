import { SplitRule } from "../";
import { defaultState, reducer } from "./reducer";

describe("splitRule list reducer", () => {
    it("should handle SPLITRULES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "SPLITRULES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const splitRule: SplitRule = {
            id: "10",
            userId: "12",
            name: "13",
            isDefault: true,
            split: [],
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_LIST_RECEIVE",
            payload: {
                items: [splitRule],
                totalItems: 1,
            },
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [splitRule],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
