import { Organisation } from "../types";
import { defaultState, reducer } from "./reducer";

describe("organisation list reducer", () => {
    it("should handle ORGANISATIONS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ORGANISATIONS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const organisation: Organisation = {
            id: "10",
            name: "Org1",
            vatRegistered: false,
            vatRegistrationDate: null,
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_LIST_RECEIVE",
            payload: {
                items: [organisation],
                totalItems: 1,
            },
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [organisation],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
