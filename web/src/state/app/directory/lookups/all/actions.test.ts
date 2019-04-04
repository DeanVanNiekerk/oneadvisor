import { allLookupsApi } from '@/config/api/directory';

import * as actions from './actions';

describe("directory: lookups: actions", () => {
    it("should dispatch API when fetchAllDirectoryLookups is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: allLookupsApi,
            dispatchPrefix: "DIRECTORY_LOOKUPS",
            onSuccess: expect.any(Function),
        };

        expect(actions.fetchAllDirectoryLookups()).toEqual(expectedAction);
    });
});
