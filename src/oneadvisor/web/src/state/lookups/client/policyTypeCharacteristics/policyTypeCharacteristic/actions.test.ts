import { policyTypeCharacteristicsApi } from "@/config/api/client";

import { PolicyTypeCharacteristicEdit } from "../types";
import * as actions from "./actions";

describe("policyTypeCharacteristic actions", () => {
    it("should dispatch API when updatePolicyTypeCharacteristic is called", () => {
        const policyTypeCharacteristic: PolicyTypeCharacteristicEdit = {
            id: "10",
            name: "n1",
            displayOrder: 0,
            policyTypeId: "1",
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
