import { Statement } from "../";
import { defaultState, reducer } from "./reducer";

const defaultStatement: Statement = {
    id: "10",
    companyId: "321",
    processed: false,
    amountIncludingVAT: 100,
    vat: 14,
    date: "2001-01-01",
    mappingErrorCount: 2,
    actualAmountIncludingVAT: 200,
    actualVAT: 16,
    commissionCount: 10,
    companyName: "Comp1",
};

describe("statement preview reducer", () => {
    it("should handle STATEMENTS_STATEMENT_PREVIEW_FETCHING", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_PREVIEW_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_PREVIEW_CLEAR", () => {
        const initalState = {
            ...defaultState,
            statement: {
                ...defaultStatement,
            },
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_PREVIEW_CLEAR",
        });

        const expectedState = {
            ...defaultState,
            statement: null,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_PREVIEW_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_PREVIEW_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_STATEMENT_PREVIEW_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_STATEMENT_PREVIEW_RECEIVE",
            payload: {
                totalItems: 1,
                sumAmountIncludingVAT: 0,
                sumVAT: 0,
                items: [defaultStatement],
            },
        });

        const expectedState = {
            ...defaultState,
            statement: { ...defaultStatement },
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
