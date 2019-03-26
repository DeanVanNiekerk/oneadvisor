import { defaultState, reducer } from './reducer';

describe("policyType list reducer", () => {
    it("should handle POLICYTYPES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const policyType = {
            id: "10",
            name: "Name1",
            code: "Code1",
        };

        const actualState = reducer(initalState, {
            type: "POLICYTYPES_LIST_RECEIVE",
            payload: [policyType],
        });

        const expectedState = {
            ...defaultState,
            items: [policyType],
        };

        expect(actualState).toEqual(expectedState);
    });
});
