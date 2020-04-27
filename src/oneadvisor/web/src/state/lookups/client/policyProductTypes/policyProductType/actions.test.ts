import { policyProductTypesApi } from "@/config/api/client";

import { PolicyProductTypeEdit } from "../types";
import * as actions from "./actions";

describe("policyProductType actions", () => {
    it("should dispatch API when updatePolicyProductType is called", () => {
        const policyProductType: PolicyProductTypeEdit = {
            id: "10",
            policyTypeId: "123",
            name: "Type 1",
            code: "type_1",
            policyTypeCharacteristics: [],
        };

        const expectedAction = {
            type: "API",
            endpoint: `${policyProductTypesApi}/10`,
            method: "POST",
            payload: policyProductType,
            dispatchPrefix: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT",
        };

        expect(actions.updatePolicyProductType(policyProductType)).toEqual(expectedAction);
    });
});
