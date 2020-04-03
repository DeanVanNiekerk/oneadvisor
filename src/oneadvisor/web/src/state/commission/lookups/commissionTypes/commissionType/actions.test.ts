import { commissionTypesApi } from "@/config/api/commission";

import { CommissionTypeEdit } from "../";
import * as actions from "./actions";

describe("commissionType actions", () => {
    it("should dispatch API when updateCommissionType is called", () => {
        const commissionType: CommissionTypeEdit = {
            id: "10",
            policyTypeId: "123",
            commissionEarningsTypeId: "654",
            name: "Type 1",
            code: "type_1",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${commissionTypesApi}/10`,
            method: "POST",
            payload: commissionType,
            dispatchPrefix: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT",
        };

        expect(actions.updateCommissionType(commissionType)).toEqual(expectedAction);
    });
});
