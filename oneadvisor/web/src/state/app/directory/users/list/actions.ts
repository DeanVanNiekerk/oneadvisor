import { PagedItems } from "@/app/table";
import { ApiAction } from "@/app/types";
import { usersApi } from "@/config/api/directory";

import { User } from "../types";

type UserListReceiveAction = {
    type: "USERS_LIST_RECEIVE";
    payload: PagedItems<User>;
};
type UserListFetchingAction = { type: "USERS_LIST_FETCHING" };
type UserListFetchingErrorAction = { type: "USERS_LIST_FETCHING_ERROR" };

export type UserListAction = UserListReceiveAction | UserListFetchingAction | UserListFetchingErrorAction;

export const fetchUsers = (): ApiAction => ({
    type: "API",
    endpoint: usersApi,
    dispatchPrefix: "USERS_LIST",
});
