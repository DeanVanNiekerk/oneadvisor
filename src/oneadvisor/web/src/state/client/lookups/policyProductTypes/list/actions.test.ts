import { policyProductTypesApi } from "@/config/api/client";

import * as actions from "./actions";

describe("directory: policyProductTypes: list actions", () => {
    it("should dispatch API when fetchPolicyProductTypes is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${policyProductTypesApi}`,
            dispatchPrefix: "POLICYPRODUCTTYPES_LIST",
        };

        expect(actions.fetchPolicyProductTypes()).toEqual(expectedAction);
    });
});
