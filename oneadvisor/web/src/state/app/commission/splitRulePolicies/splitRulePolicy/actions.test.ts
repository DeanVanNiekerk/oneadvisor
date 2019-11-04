import { splitRulePoliciesApi } from "@/config/api/commission";

import { SplitRulePolicy } from "../types";
import * as actions from "./actions";

describe("splitRulePolicy actions", () => {
    it("should dispatch API when fetchSplitRulePolicy is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${splitRulePoliciesApi}/99`,
            dispatchPrefix: "SPLITRULEPOLICIES_SPLITRULEPOLICY",
        };

        expect(actions.fetchSplitRulePolicy("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateSplitRulePolicy is called", () => {
        const splitRulePolicy: SplitRulePolicy = {
            id: "10",
            commissionSplitRuleId: "12",
            policyId: "13",
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${splitRulePoliciesApi}/10`,
            method: "POST",
            payload: splitRulePolicy,
            onSuccess: onSuccess,
            dispatchPrefix: "SPLITRULEPOLICIES_SPLITRULEPOLICY_EDIT",
        };

        expect(actions.updateSplitRulePolicy(splitRulePolicy, onSuccess)).toEqual(expectedAction);
    });

    it("should dispatch API when deleteSplitRulePolicy is called", () => {
        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${splitRulePoliciesApi}/10`,
            method: "DELETE",
            onSuccess: onSuccess,
        };

        expect(actions.deleteSplitRulePolicy("10", onSuccess)).toEqual(expectedAction);
    });
});
