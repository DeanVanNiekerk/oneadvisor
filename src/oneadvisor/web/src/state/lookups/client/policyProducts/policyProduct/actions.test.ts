import { policyProductsApi } from "@/config/api/client";

import { PolicyProductEdit } from "../types";
import * as actions from "./actions";

describe("policyProduct actions", () => {
    it("should dispatch API when updatePolicyProduct is called", () => {
        const policyProduct: PolicyProductEdit = {
            id: "10",
            policyProductTypeId: "123",
            companyId: "321",
            name: "Type 1",
            code: "type_1",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${policyProductsApi}/10`,
            method: "POST",
            payload: policyProduct,
            dispatchPrefix: "POLICYPRODUCTS_POLICYPRODUCT_EDIT",
        };

        expect(actions.updatePolicyProduct(policyProduct)).toEqual(expectedAction);
    });
});
