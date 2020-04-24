import { getValidationResult } from "@/test";

import { AdviceServiceEdit } from "../";
import { defaultState, reducer } from "./reducer";

describe("adviceService reducer", () => {
    it("should handle ADVICESERVICES_ADVICESERVICE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const adviceService: AdviceServiceEdit = {
            id: "10",
            name: "n1",
            displayOrder: 1,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESERVICES_ADVICESERVICE_RECEIVE",
            payload: { ...adviceService },
        });

        const expectedState = {
            ...defaultState,
            adviceService: { ...adviceService },
            adviceServiceOriginal: { ...adviceService },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_ADVICESERVICE_MODIFIED", () => {
        const adviceService: AdviceServiceEdit = {
            id: "10",
            name: "n1",
            displayOrder: 1,
        };

        const initalState = {
            ...defaultState,
            adviceService: adviceService,
            adviceServiceOriginal: adviceService,
        };

        const adviceServiceModified: AdviceServiceEdit = {
            ...adviceService,
            name: "New Name!",
        };

        const actualState = reducer(initalState, {
            type: "ADVICESERVICES_ADVICESERVICE_MODIFIED",
            payload: { ...adviceServiceModified },
        });

        const expectedState = {
            ...initalState,
            adviceService: { ...adviceServiceModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_ADVICESERVICE_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "ADVICESERVICES_ADVICESERVICE_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ADVICESERVICES_ADVICESERVICE_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ADVICESERVICES_ADVICESERVICE_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
