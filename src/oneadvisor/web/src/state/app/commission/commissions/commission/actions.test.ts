import { commissionsApi } from "@/config/api/commission";

import { CommissionEdit } from "../";
import * as actions from "./actions";

describe("commission actions", () => {
    it("should dispatch API when fetchCommission is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${commissionsApi}/99`,
            dispatchPrefix: "COMMISSIONS_COMMISSION",
        };

        expect(actions.fetchCommission("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateCommission is called", () => {
        const commission: CommissionEdit = {
            id: "10",
            policyId: "99",
            userId: "500",
            splitGroupId: null,
            commissionTypeId: "321",
            amountIncludingVAT: 100,
            vat: 14,
            commissionStatementId: "998877",
            sourceData: null,
        };

        const expectedAction = {
            type: "API",
            endpoint: `${commissionsApi}/10`,
            method: "POST",
            payload: commission,
            dispatchPrefix: "COMMISSIONS_COMMISSION_EDIT",
        };

        expect(actions.updateCommission(commission)).toEqual(expectedAction);
    });
});
