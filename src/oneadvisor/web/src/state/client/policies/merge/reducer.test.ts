import { defaultState, reducer } from "./reducer";

describe("policy merge reducer", () => {
    it("should handle POLICIES_MERGE_VISIBLE", () => {
        const actualState = reducer(defaultState, {
            type: "POLICIES_MERGE_VISIBLE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            visible: true,
        };

        expect(actualState).toEqual(expectedState);
    });
});
