import { ApiAction } from "@/app/types";
import { rolesApi } from "@/config/api/directory";

import { Role } from "../types";

type RoleListReceiveAction = {
    type: "ROLES_LIST_RECEIVE";
    payload: Role[];
};
type RoleListFetchingAction = { type: "ROLES_LIST_FETCHING" };
type RoleListFetchingErrorAction = { type: "ROLES_LIST_FETCHING_ERROR" };

export type RoleListAction = RoleListReceiveAction | RoleListFetchingAction | RoleListFetchingErrorAction;

export const fetchRoles = (): ApiAction => ({
    type: "API",
    endpoint: rolesApi,
    dispatchPrefix: "ROLES_LIST",
});
