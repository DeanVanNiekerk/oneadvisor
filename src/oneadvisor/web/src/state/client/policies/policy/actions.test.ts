import { policiesApi } from "@/config/api/client";

import { PolicyEdit } from "../types";
import * as actions from "./actions";

describe("policy actions", () => {
    it("should dispatch API when fetchPolicy is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${policiesApi}/99`,
            dispatchPrefix: "POLICIES_POLICY",
        };

        expect(actions.fetchPolicy("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updatePolicy is called", () => {
        const policy: PolicyEdit = {
            id: "10",
            clientId: "12",
            companyId: "100",
            userId: "1",
            number: "987654",
            premium: 500,
            startDate: "1999-01-01",
            policyTypeId: "123321",
            policyProductTypeId: "00111",
            policyProductId: "99988777",
            isActive: true,
            numberAliases: [],
        };

        const expectedAction = {
            type: "API",
            endpoint: `${policiesApi}/10`,
            method: "POST",
            payload: policy,
            dispatchPrefix: "POLICIES_POLICY_EDIT",
        };

        expect(actions.updatePolicy(policy)).toEqual(expectedAction);
    });
});
