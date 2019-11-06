import { defaultState, reducer } from "./reducer";

describe("commissionEarningsType list reducer", () => {
    it("should handle COMMISSIONEARNINGSTYPE_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const commissionEarningsType = {
            id: "10",
            name: "Type1",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONEARNINGSTYPE_LIST_RECEIVE",
            payload: [commissionEarningsType],
        });

        const expectedState = {
            ...defaultState,
            items: [commissionEarningsType],
        };

        expect(actualState).toEqual(expectedState);
    });
});
