import { getValidationResult } from "@/test";

import { LicenseCategoryEdit } from "../";
import { defaultState, reducer } from "./reducer";

describe("licenseCategory reducer", () => {
    it("should handle LICENSECATEGORIES_LICENSECATEGORY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const licenseCategory: LicenseCategoryEdit = {
            id: "10",
            code: "c1",
            name: "n1",
        };

        const actualState = reducer(initalState, {
            type: "LICENSECATEGORIES_LICENSECATEGORY_RECEIVE",
            payload: { ...licenseCategory },
        });

        const expectedState = {
            ...defaultState,
            licenseCategory: { ...licenseCategory },
            licenseCategoryOriginal: { ...licenseCategory },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LICENSECATEGORY_MODIFIED", () => {
        const licenseCategory: LicenseCategoryEdit = {
            id: "10",
            code: "c1",
            name: "n1",
        };

        const initalState = {
            ...defaultState,
            licenseCategory: licenseCategory,
            licenseCategoryOriginal: licenseCategory,
        };

        const licenseCategoryModified: LicenseCategoryEdit = {
            ...licenseCategory,
            name: "New Name!",
        };

        const actualState = reducer(initalState, {
            type: "LICENSECATEGORIES_LICENSECATEGORY_MODIFIED",
            payload: { ...licenseCategoryModified },
        });

        const expectedState = {
            ...initalState,
            licenseCategory: { ...licenseCategoryModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LICENSECATEGORY_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "LICENSECATEGORIES_LICENSECATEGORY_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle LICENSECATEGORIES_LICENSECATEGORY_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
