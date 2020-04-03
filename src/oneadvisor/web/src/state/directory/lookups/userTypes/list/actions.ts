import { UserType } from "../types";

type UserTypeListReceiveAction = {
    type: "USERTYPES_LIST_RECEIVE";
    payload: UserType[];
};

export type UserTypeListAction = UserTypeListReceiveAction;

export const receiveUserTypes = (payload: UserType[]): UserTypeListAction => ({
    type: "USERTYPES_LIST_RECEIVE",
    payload,
});
