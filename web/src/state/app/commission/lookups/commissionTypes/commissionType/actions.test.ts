import { commissionTypesApi } from '@/config/api/directory';

import { CommissionType } from '../';
import * as actions from './actions';

describe("commissionType actions", () => {
    it("should dispatch API when updateCommissionType is called", () => {
        const commissionType: CommissionType = {
            id: "10",
            policyTypeId: "123",
            commissionEarningsTypeId: "654",
            name: "Type 1",
            code: "type_1",
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${commissionTypesApi}/10`,
            method: "POST",
            payload: commissionType,
            onSuccess: onSuccess,
            dispatchPrefix: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT",
        };

        expect(actions.updateCommissionType(commissionType, onSuccess)).toEqual(
            expectedAction
        );
    });
});
