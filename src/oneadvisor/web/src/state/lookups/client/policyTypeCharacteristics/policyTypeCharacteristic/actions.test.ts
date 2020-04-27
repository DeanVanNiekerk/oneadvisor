import { policyTypeCharacteristicsApi } from "@/config/api/client";

import { PolicyTypeCharacteristicEdit } from "../types";
import * as actions from "./actions";

describe("policyTypeCharacteristic actions", () => {
    it("should dispatch API when updatePolicyTypeCharacteristic is called", () => {
        const policyTypeCharacteristic: PolicyTypeCharacteristicEdit = {
            id: "10",
            policyTypeId: "123",
            name: "Type 1",
            code: "type_1",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${policyTypeCharacteristicsApi}/10`,
            method: "POST",
            payload: policyTypeCharacteristic,
            dispatchPrefix: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT",
        };

        expect(actions.updatePolicyTypeCharacteristic(policyTypeCharacteristic)).toEqual(
            expectedAction
        );
    });
});
