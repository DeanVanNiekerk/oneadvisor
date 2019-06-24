import { usersApi } from '@/config/api/directory';

import * as actions from './actions';

describe("user simple actions", () => {
    it("should dispatch API when fetchUserSimple is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${usersApi}/simple/99`,
            dispatchPrefix: "USERSSIMPLE_USER",
        };

        expect(actions.fetchUserSimple("99")).toEqual(expectedAction);
    });

    it("should dispatch UserReceiveAction when receiveUserSimple is called", () => {
        const user = {
            id: "123",
            firstName: "dean",
            lastName: "van",
            fullName: "DJ",
            branchId: "321321",
        };

        const expectedAction = {
            type: "USERSSIMPLE_USER_RECEIVE",
            payload: user,
        };

        expect(actions.receiveUserSimple(user)).toEqual(expectedAction);
    });
});
