import { splitRulesApi } from "@/config/api/commission";

import { SplitRule } from "../";
import * as actions from "./actions";

describe("splitRule actions", () => {
    it("should dispatch API when fetchSplitRule is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${splitRulesApi}/99`,
            dispatchPrefix: "SPLITRULES_SPLITRULE",
        };

        expect(actions.fetchSplitRule("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateSplitRule is called", () => {
        const splitRule: SplitRule = {
            id: "10",
            userId: "12",
            name: "13",
            isDefault: true,
            split: [],
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${splitRulesApi}/10`,
            method: "POST",
            payload: splitRule,
            onSuccess: onSuccess,
            dispatchPrefix: "SPLITRULES_SPLITRULE_EDIT",
        };

        expect(actions.updateSplitRule(splitRule, onSuccess)).toEqual(expectedAction);
    });

    it("should dispatch API when deleteSplitRule is called", () => {
        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${splitRulesApi}/10`,
            method: "DELETE",
            onSuccess: onSuccess,
        };

        expect(actions.deleteSplitRule("10", onSuccess)).toEqual(expectedAction);
    });
});
