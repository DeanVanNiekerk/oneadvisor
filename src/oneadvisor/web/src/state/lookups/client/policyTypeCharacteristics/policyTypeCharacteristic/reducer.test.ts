import { getValidationResult } from "@/test";

import { PolicyTypeCharacteristicEdit } from "../types";
import { defaultState, reducer } from "./reducer";

describe("policyTypeCharacteristic reducer", () => {
    it("should handle POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const policyTypeCharacteristic: PolicyTypeCharacteristicEdit = {
            id: "10",
            name: "n1",
            displayOrder: 0,
            policyTypeId: null,
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE",
            payload: { ...policyTypeCharacteristic },
        });

        const expectedState = {
            ...defaultState,
            policyTypeCharacteristic: { ...policyTypeCharacteristic },
            policyTypeCharacteristicOriginal: { ...policyTypeCharacteristic },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_MODIFIED", () => {
        const policyTypeCharacteristic: PolicyTypeCharacteristicEdit = {
            id: "10",
            name: "n1",
            displayOrder: 0,
            policyTypeId: null,
        };

        const initalState = {
            ...defaultState,
            policyTypeCharacteristic: policyTypeCharacteristic,
            policyTypeCharacteristicOriginal: policyTypeCharacteristic,
        };

        const policyTypeCharacteristicModified: PolicyTypeCharacteristicEdit = {
            ...policyTypeCharacteristic,
            name: "New Name!",
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_MODIFIED",
            payload: { ...policyTypeCharacteristicModified },
        });

        const expectedState = {
            ...initalState,
            policyTypeCharacteristic: { ...policyTypeCharacteristicModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
