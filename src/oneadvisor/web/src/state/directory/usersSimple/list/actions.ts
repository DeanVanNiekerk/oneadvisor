import { PagedItems } from "@/app/table";
import { ApiAction } from "@/app/types";
import { usersApi } from "@/config/api/directory";

import { UserSimple } from "../types";

type UserSimpleListReceiveAction = {
    type: "USERSSIMPLE_LIST_RECEIVE";
    payload: PagedItems<UserSimple>;
};
type UserSimpleListFetchingAction = { type: "USERSSIMPLE_LIST_FETCHING" };
type UserSimpleListFetchingErrorAction = {
    type: "USERSSIMPLE_LIST_FETCHING_ERROR";
};

export type UserSimpleListAction =
    | UserSimpleListReceiveAction
    | UserSimpleListFetchingAction
    | UserSimpleListFetchingErrorAction;

export const fetchUsersSimple = (): ApiAction => ({
    type: "API",
    endpoint: `${usersApi}/simple`,
    dispatchPrefix: "USERSSIMPLE_LIST",
});
