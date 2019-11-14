import { policyProductsApi } from "@/config/api/client";

import * as actions from "./actions";

describe("directory: policyProducts: list actions", () => {
    it("should dispatch API when fetchPolicyProducts is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${policyProductsApi}`,
            dispatchPrefix: "POLICYPRODUCTS_LIST",
        };

        expect(actions.fetchPolicyProducts()).toEqual(expectedAction);
    });
});
