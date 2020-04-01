import { Application } from "../";
import { defaultState, reducer } from "./reducer";

describe("application list reducer", () => {
    it("should handle APPLICATIONS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "APPLICATIONS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle APPLICATIONS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "APPLICATIONS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle APPLICATIONS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const application: Application = {
            id: "10",
            name: "Application1",
            colourHex: "#FFFFFF",
        };

        const actualState = reducer(initalState, {
            type: "APPLICATIONS_LIST_RECEIVE",
            payload: [application],
        });

        const expectedState = {
            ...defaultState,
            items: [application],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
