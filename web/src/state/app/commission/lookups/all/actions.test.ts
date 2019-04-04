import { allLookupsApi } from '@/config/api/directory';

import * as actions from './actions';

describe("commission: lookups: actions", () => {
    it("should dispatch API when fetchAllCommissionLookups is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: allLookupsApi,
            dispatchPrefix: "COMMISSION_LOOKUPS",
            onSuccess: expect.any(Function),
        };

        expect(actions.fetchAllCommissionLookups()).toEqual(expectedAction);
    });
});
