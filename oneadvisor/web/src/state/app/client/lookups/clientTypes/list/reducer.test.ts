import { defaultState, reducer } from "./reducer";

describe("clientType list reducer", () => {
    it("should handle CLIENTTYPES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const clientType = {
            id: "10",
            name: "Name1",
            code: "Code1",
        };

        const actualState = reducer(initalState, {
            type: "CLIENTTYPES_LIST_RECEIVE",
            payload: [clientType],
        });

        const expectedState = {
            ...defaultState,
            items: [clientType],
        };

        expect(actualState).toEqual(expectedState);
    });
});
