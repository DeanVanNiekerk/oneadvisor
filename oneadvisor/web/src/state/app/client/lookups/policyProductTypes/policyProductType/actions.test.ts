import { policyProductTypesApi } from "@/config/api/client";

import { PolicyProductType } from "../";
import * as actions from "./actions";

describe("policyProductType actions", () => {
    it("should dispatch API when updatePolicyProductType is called", () => {
        const policyProductType: PolicyProductType = {
            id: "10",
            policyTypeId: "123",
            name: "Type 1",
            code: "type_1",
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${policyProductTypesApi}/10`,
            method: "POST",
            payload: policyProductType,
            onSuccess: onSuccess,
            dispatchPrefix: "POLICYPRODUCTTYPES_POLICYPRODUCTTYPE_EDIT",
        };

        expect(actions.updatePolicyProductType(policyProductType, onSuccess)).toEqual(
            expectedAction
        );
    });
});
