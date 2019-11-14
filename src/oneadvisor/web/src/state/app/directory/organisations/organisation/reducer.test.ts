import { getValidationResult } from "@/test";

import { OrganisationEdit } from "../types";
import { defaultState, reducer } from "./reducer";

describe("organisation reducer", () => {
    it("should handle ORGANISATIONS_ORGANISATION_FETCHING", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_ORGANISATION_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_ORGANISATION_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_ORGANISATION_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_ORGANISATION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const organisation: OrganisationEdit = {
            id: "10",
            name: "Org1",
            vatRegistered: false,
            vatRegistrationDate: null,
            config: {
                companyIds: [],
            },
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_ORGANISATION_RECEIVE",
            payload: { ...organisation },
        });

        const expectedState = {
            ...defaultState,
            organisation: { ...organisation },
            organisationOriginal: { ...organisation },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_ORGANISATION_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "ORGANISATIONS_ORGANISATION_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ORGANISATIONS_ORGANISATION_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "ORGANISATIONS_ORGANISATION_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
