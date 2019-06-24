import { getValidationResult } from '@/test';

import { SplitRule } from '../';
import { defaultState, reducer } from './reducer';

describe("splitRule reducer", () => {
    it("should handle SPLITRULES_SPLITRULE_FETCHING", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_SPLITRULE_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_SPLITRULE_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_SPLITRULE_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_SPLITRULE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const splitRule: SplitRule = {
            id: "10",
            userId: "12",
            name: "13",
            isDefault: true,
            split: [],
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_SPLITRULE_RECEIVE",
            payload: { ...splitRule },
        });

        const expectedState = {
            ...defaultState,
            splitRule: { ...splitRule },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_SPLITRULE_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "SPLITRULES_SPLITRULE_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_SPLITRULE_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_SPLITRULE_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle SPLITRULES_SPLITRULE_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "SPLITRULES_SPLITRULE_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
