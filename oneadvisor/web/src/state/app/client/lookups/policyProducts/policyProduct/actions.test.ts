import { policyProductsApi } from "@/config/api/client";

import { PolicyProduct } from "../";
import * as actions from "./actions";

describe("policyProduct actions", () => {
    it("should dispatch API when updatePolicyProduct is called", () => {
        const policyProduct: PolicyProduct = {
            id: "10",
            policyProductTypeId: "123",
            companyId: "321",
            name: "Type 1",
            code: "type_1",
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${policyProductsApi}/10`,
            method: "POST",
            payload: policyProduct,
            onSuccess: onSuccess,
            dispatchPrefix: "POLICYPRODUCTS_POLICYPRODUCT_EDIT",
        };

        expect(actions.updatePolicyProduct(policyProduct, onSuccess)).toEqual(expectedAction);
    });
});
