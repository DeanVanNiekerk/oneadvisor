import { LicenseCategory } from "../types";
import { defaultState, reducer } from "./reducer";

describe("licenseCategory list reducer", () => {
    it("should handle LICENSECATEGORIES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "LICENSECATEGORIES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "LICENSECATEGORIES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const licenseCategory: LicenseCategory = {
            id: "10",
            code: "c1",
            name: "n1",
        };

        const actualState = reducer(initalState, {
            type: "LICENSECATEGORIES_LIST_RECEIVE",
            payload: [licenseCategory],
        });

        const expectedState = {
            ...defaultState,
            items: [licenseCategory],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
