import { defaultState, reducer } from "./reducer";

describe("marritalStatus list reducer", () => {
    it("should handle MARRITALSTATUS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const marritalStatus = {
            id: "10",
            name: "Org1",
        };

        const actualState = reducer(initalState, {
            type: "MARRITALSTATUS_LIST_RECEIVE",
            payload: [marritalStatus],
        });

        const expectedState = {
            ...defaultState,
            items: [marritalStatus],
        };

        expect(actualState).toEqual(expectedState);
    });
});
