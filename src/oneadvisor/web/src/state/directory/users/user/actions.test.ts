import { usersApi } from "@/config/api/directory";

import { getConfig } from "../helpers";
import { UserEdit } from "../types";
import * as actions from "./actions";

const defaultUser: UserEdit = {
    id: "10",
    firstName: "Dean",
    lastName: "Jackson",
    email: "dean@gmail.com",
    userName: "dean",
    branchId: "12341234",
    roles: ["role_1"],
    scope: 1,
    aliases: ["DJ"],
    isLocked: false,
    userTypeId: "123",
    config: getConfig(),
};

describe("user actions", () => {
    it("should dispatch API when fetchUser is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${usersApi}/99`,
            dispatchPrefix: "USERS_USER",
        };

        expect(actions.fetchUser("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateUser is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${usersApi}/10`,
            method: "POST",
            payload: defaultUser,
            dispatchPrefix: "USERS_USER_EDIT",
        };

        expect(actions.updateUser(defaultUser)).toEqual(expectedAction);
    });

    it("should dispatch API when insertUser is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${usersApi}`,
            method: "POST",
            payload: defaultUser,
            dispatchPrefix: "USERS_USER_EDIT",
        };

        expect(actions.insertUser(defaultUser)).toEqual(expectedAction);
    });
});
