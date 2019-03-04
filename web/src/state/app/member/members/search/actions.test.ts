import { Filters } from '@/app/table';
import { membersApi } from '@/config/api/member';

import * as actions from './actions';

describe("member: members: search actions", () => {
    it("should dispatch API when searchMembers is called", () => {
        const filters: Filters = {
            lastName: ["van"],
        };

        const api = `${membersApi}?pageNumber=1&pageSize=100&sortColumn=lastName&sortDirection=asc&filters=lastName%3Dvan`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "MEMBERS_SEARCH",
        };

        expect(actions.searchMembers(filters)).toEqual(expectedAction);
    });
});
