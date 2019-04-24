import { allocationsApi } from '@/config/api/commission';

import * as actions from './actions';

describe("allocation actions", () => {
    it("should dispatch API when fetchAllocation is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${allocationsApi}/99`,
            dispatchPrefix: "ALLOCATIONS_ALLOCATION",
        };

        expect(actions.fetchAllocation("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateAllocation is called", () => {
        const allocation = {
            id: "10",
            fromClientId: "12",
            toClientId: "13",
            policyIds: ["14"],
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${allocationsApi}/10`,
            method: "POST",
            payload: allocation,
            onSuccess: onSuccess,
            dispatchPrefix: "ALLOCATIONS_ALLOCATION_EDIT",
        };

        expect(actions.updateAllocation(allocation, onSuccess)).toEqual(
            expectedAction
        );
    });

    it("should dispatch API when deleteAllocation is called", () => {
        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${allocationsApi}/10`,
            method: "DELETE",
            onSuccess: onSuccess,
        };

        expect(actions.deleteAllocation("10", onSuccess)).toEqual(
            expectedAction
        );
    });
});
