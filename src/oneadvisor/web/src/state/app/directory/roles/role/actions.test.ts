import { rolesApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("role actions", () => {
    it("should dispatch API when fetchRole is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${rolesApi}/99`,
            dispatchPrefix: "ROLES_ROLE",
        };

        expect(actions.fetchRole("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateRole is called", () => {
        const role = {
            id: "10",
            name: "Role1",
            description: "Role1 Desc",
            applicationId: "app_1",
            useCaseIds: ["uc1"],
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${rolesApi}/10`,
            method: "POST",
            payload: role,
            onSuccess: onSuccess,
            dispatchPrefix: "ROLES_ROLE_EDIT",
        };

        expect(actions.updateRole(role, onSuccess)).toEqual(expectedAction);
    });
});
