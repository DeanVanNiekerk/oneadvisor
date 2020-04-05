import { getValidationResult } from "@/test";

import { AdviceScopeEdit } from "../";
import { defaultState, reducer } from "./reducer";

describe("adviceScope reducer", () => {
    it("should handle ADVICESCOPES_ADVICESCOPE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const adviceScope: AdviceScopeEdit = {
            id: "10",
            name: "n1",
        };

        const actualState = reducer(initalState, {
            type: "ADVICESCOPES_ADVICESCOPE_RECEIVE",
            payload: { ...adviceScope },
        });

        const expectedState = {
            ...defaultState,
            adviceScope: { ...adviceScope },
            adviceScopeOriginal: { ...adviceScope },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_ADVICESCOPE_MODIFIED", () => {
        const adviceScope: AdviceScopeEdit = {
            id: "10",
            name: "n1",
        };

        const initalState = {
            ...defaultState,
            adviceScope: adviceScope,
            adviceScopeOriginal: adviceScope,
        };

        const adviceScopeModified: AdviceScopeEdit = {
            ...adviceScope,
            name: "New Name!",
        };

        const actualState = reducer(initalState, {
            type: "ADVICESCOPES_ADVICESCOPE_MODIFIED",
            payload: { ...adviceScopeModified },
        });

        const expectedState = {
            ...initalState,
            adviceScope: { ...adviceScopeModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_ADVICESCOPE_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "ADVICESCOPES_ADVICESCOPE_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESCOPES_ADVICESCOPE_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESCOPES_ADVICESCOPE_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
