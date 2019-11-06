import { allCommissionLookupsApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("commission: lookups: actions", () => {
    it("should dispatch API when fetchAllCommissionLookups is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: allCommissionLookupsApi,
            dispatchPrefix: "COMMISSION_LOOKUPS",
            onSuccess: expect.any(Function),
        };

        expect(actions.fetchAllCommissionLookups()).toEqual(expectedAction);
    });
});
