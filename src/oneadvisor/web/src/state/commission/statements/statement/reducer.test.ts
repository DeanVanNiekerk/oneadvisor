import { getValidationResult } from "@/test";

import { StatementEdit } from "../";
import { defaultState, reducer } from "./reducer";

const defaultStatement: StatementEdit = {
    id: "10",
    companyId: "321",
    processed: false,
    amountIncludingVAT: 100,
    vat: 14,
    date: "2001-01-01",
    notes: "note 1",
};

describe("statement reducer", () => {
    it("should handle STATEMENTS_STATEMENT_FETCHING", () => {
        const initalState = {
            ...defaultState,
            statement: { ...defaultStatement },
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            statement: null,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_RECEIVE",
            payload: { ...defaultStatement },
        });

        const expectedState = {
            ...defaultState,
            statement: { ...defaultStatement },
            statementOriginal: { ...defaultStatement },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_MODIFIED", () => {
        const statement = {
            ...defaultStatement,
        };

        const initalState = {
            ...defaultState,
            statement: statement,
            statementOriginal: statement,
        };

        const statementModified: StatementEdit = {
            ...statement,
            companyId: "665544774",
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_MODIFIED",
            payload: { ...statementModified },
        });

        const expectedState = {
            ...initalState,
            statement: { ...statementModified },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "STATEMENTS_STATEMENT_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "STATEMENTS_STATEMENT_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
