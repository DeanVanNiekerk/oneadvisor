import { getValidationResult } from "@/test";

import { Company } from "../";
import { defaultState, reducer } from "./reducer";

describe("company reducer", () => {
    it("should handle COMPANIES_COMPANY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const company: Company = {
            id: "10",
            name: "Org1",
            commissionPolicyNumberPrefixes: ["pre_1"],
        };

        const actualState = reducer(initalState, {
            type: "COMPANIES_COMPANY_RECEIVE",
            payload: { ...company },
        });

        const expectedState = {
            ...defaultState,
            company: { ...company },
            companyOriginal: { ...company },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_COMPANY_MODIFIED", () => {
        const company: Company = {
            id: "10",
            name: "Org1",
            commissionPolicyNumberPrefixes: ["pre_1"],
        };

        const initalState = {
            ...defaultState,
            company: company,
            companyOriginal: company,
        };

        const companyModified: Company = {
            ...company,
            name: "New Name!",
        };

        const actualState = reducer(initalState, {
            type: "COMPANIES_COMPANY_MODIFIED",
            payload: { ...companyModified },
        });

        const expectedState = {
            ...initalState,
            company: { ...companyModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_COMPANY_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "COMPANIES_COMPANY_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_COMPANY_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMPANIES_COMPANY_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_COMPANY_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "COMPANIES_COMPANY_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPANIES_COMPANY_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "COMPANIES_COMPANY_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
