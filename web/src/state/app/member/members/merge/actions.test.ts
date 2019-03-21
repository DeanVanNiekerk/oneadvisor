import { membersApi } from '@/config/api/member';

import * as actions from './actions';

describe("member: merge: actions", () => {
    it("should dispatch API when fetchMergeMembers is called", () => {
        const api = `${membersApi}?filters=memberId%3D123`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "MEMBERS_MERGE",
        };

        expect(actions.fetchMergeMembers(["123"])).toEqual(expectedAction);
    });

    it("should dispatch MEMBERS_MERGE_NEXT_STEP when memberMergeNextStep is called", () => {
        const expectedAction = {
            type: "MEMBERS_MERGE_NEXT_STEP",
        };

        expect(actions.memberMergeNextStep()).toEqual(expectedAction);
    });

    it("should dispatch MEMBERS_MERGE_PREVIOUS_STEP when memberMergePreviousStep is called", () => {
        const expectedAction = {
            type: "MEMBERS_MERGE_PREVIOUS_STEP",
        };

        expect(actions.memberMergePreviousStep()).toEqual(expectedAction);
    });
});
