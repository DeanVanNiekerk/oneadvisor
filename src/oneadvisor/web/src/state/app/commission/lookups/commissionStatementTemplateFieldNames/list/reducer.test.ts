import { defaultState, reducer } from "./reducer";

describe("CommissionStatementTemplateFieldName list reducer", () => {
    it("should handle COMMISSIONSTATEMENTTEMPLATEFIELDNAMES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const commissionStatementTemplateFieldName = {
            id: "10",
            name: "Type 1",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONSTATEMENTTEMPLATEFIELDNAMES_LIST_RECEIVE",
            payload: [commissionStatementTemplateFieldName],
        });

        const expectedState = {
            ...defaultState,
            items: [commissionStatementTemplateFieldName],
        };

        expect(actualState).toEqual(expectedState);
    });
});
