import { allClientLookupsApi } from '@/config/api/client';

import * as actions from './actions';

describe("client: lookups: actions", () => {
    it("should dispatch API when fetchAllClientLookups is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: allClientLookupsApi,
            dispatchPrefix: "CLIENT_LOOKUPS",
            onSuccess: expect.any(Function),
        };

        expect(actions.fetchAllClientLookups()).toEqual(expectedAction);
    });
});
