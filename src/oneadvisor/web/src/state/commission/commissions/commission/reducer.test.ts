import { getValidationResult } from "@/test";

import { CommissionEdit } from "../";
import { defaultState, reducer } from "./reducer";

const defaultCommission: CommissionEdit = {
    id: "10",
    policyId: "99",
    commissionTypeId: "321",
    amountIncludingVAT: 100,
    vat: 14,
    commissionStatementId: "998877",
    sourceData: null,
    userId: "500",
    splitGroupId: null,
};

describe("commission reducer", () => {
    it("should handle COMMISSIONS_COMMISSION_FETCHING", () => {
        const initalState = {
            ...defaultState,
            commission: { ...defaultCommission },
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_COMMISSION_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            commission: null,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_COMMISSION_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_COMMISSION_RECEIVE",
            payload: { ...defaultCommission },
        });

        const expectedState = {
            ...defaultState,
            commission: { ...defaultCommission },
            commissionOriginal: { ...defaultCommission },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_MODIFIED", () => {
        const commission = {
            ...defaultCommission,
        };

        const initalState = {
            ...defaultState,
            commission: commission,
            commissionOriginal: commission,
        };

        const commissionModified: CommissionEdit = {
            ...commission,
            amountIncludingVAT: 774,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_COMMISSION_MODIFIED",
            payload: { ...commissionModified },
        });

        const expectedState = {
            ...initalState,
            commission: { ...commissionModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_COMMISSION_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_COMMISSION_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_COMMISSION_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_COMMISSION_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_COMMISSION_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
