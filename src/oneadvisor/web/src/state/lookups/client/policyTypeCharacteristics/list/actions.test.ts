import { policyTypeCharacteristicsApi } from "@/config/api/client";

import * as actions from "./actions";

describe("directory: policyTypeCharacteristics: list actions", () => {
    it("should dispatch API when fetchPolicyTypeCharacteristics is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${policyTypeCharacteristicsApi}`,
            dispatchPrefix: "POLICYTYPECHARACTERISTICS_LIST",
        };

        expect(actions.fetchPolicyTypeCharacteristics()).toEqual(expectedAction);
    });
});
