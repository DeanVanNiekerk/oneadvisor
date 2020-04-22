import * as actions from "./actions";

describe("client: merge: actions", () => {
    it("should dispatch POLICIES_MERGE_VISIBLE when policyMergeVisible is called", () => {
        const expectedAction = {
            type: "POLICIES_MERGE_VISIBLE",
            payload: true,
        };

        expect(actions.policyMergeVisible(true)).toEqual(expectedAction);
    });
});
