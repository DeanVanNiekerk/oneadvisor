import { allLookupsApi } from '@/config/api/directory';

import * as actions from './actions';

describe("client: lookups: actions", () => {
    it("should dispatch API when fetchAllClientLookups is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: allLookupsApi,
            dispatchPrefix: "CLIENT_LOOKUPS",
            onSuccess: expect.any(Function),
        };

        expect(actions.fetchAllClientLookups()).toEqual(expectedAction);
    });
});
