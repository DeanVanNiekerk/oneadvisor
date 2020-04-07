import { AdviceService } from "../types";
import { defaultState, reducer } from "./reducer";

describe("adviceService list reducer", () => {
    it("should handle ADVICESERVICES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ADVICESERVICES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESERVICES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const adviceService: AdviceService = {
            id: "10",
            name: "n1",
            displayOrder: 1,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESERVICES_LIST_RECEIVE",
            payload: [adviceService],
        });

        const expectedState = {
            ...defaultState,
            items: [adviceService],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
