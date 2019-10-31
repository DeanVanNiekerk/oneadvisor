import { getValidationResult } from "@/test";

import { CommissionErrorEdit } from "../types";
import { defaultState, reducer } from "./reducer";

const defaultCommissionError: CommissionErrorEdit = {
    id: "10",
    commissionStatementId: "321",
    policyId: "12",
    clientId: "13",
    commissionTypeId: "14",
    data: {
        policyNumber: "123-123",
        amountIncludingVAT: "50",
        vat: "5",
        commissionTypeCode: "gap_cover",
    },
};

describe("commission mapping error reducer", () => {
    it("should handle COMMISSIONS_ERROR_MAPPING_FETCHING", () => {
        const initalState = {
            ...defaultState,
            commissionError: { ...defaultCommissionError },
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERROR_MAPPING_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            commissionError: null,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERROR_MAPPING_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERROR_MAPPING_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERROR_MAPPING_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERROR_MAPPING_RECEIVE",
            payload: { ...defaultCommissionError },
        });

        const expectedState = {
            ...defaultState,
            commissionError: { ...defaultCommissionError },
            commissionErrorOriginal: { ...defaultCommissionError },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERROR_MAPPING_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERROR_MAPPING_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
