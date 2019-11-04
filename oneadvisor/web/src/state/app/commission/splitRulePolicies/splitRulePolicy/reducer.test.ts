import { getValidationResult } from "@/test";

import { SplitRulePolicy } from "../";
import { defaultState, reducer } from "./reducer";

describe("splitRulePolicy reducer", () => {
    it("should handle SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_SPLITRULEPOLICY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const splitRulePolicy: SplitRulePolicy = {
            id: "10",
            commissionSplitRuleId: "12",
            policyId: "13",
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_RECEIVE",
            payload: { ...splitRulePolicy },
        });

        const expectedState = {
            ...defaultState,
            splitRulePolicy: { ...splitRulePolicy },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
