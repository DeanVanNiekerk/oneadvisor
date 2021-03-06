import { PolicyTypeCharacteristic } from "../types";
import { defaultState, reducer } from "./reducer";

describe("policyTypeCharacteristic list reducer", () => {
    it("should handle POLICYTYPECHARACTERISTICS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICYTYPECHARACTERISTICS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPECHARACTERISTICS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICYTYPECHARACTERISTICS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const policyTypeCharacteristic: PolicyTypeCharacteristic = {
            id: "10",
            name: "n1",
            displayOrder: 0,
            policyTypeId: "1",
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPECHARACTERISTICS_LIST_RECEIVE",
            payload: [policyTypeCharacteristic],
        });

        const expectedState = {
            ...defaultState,
            items: [policyTypeCharacteristic],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
