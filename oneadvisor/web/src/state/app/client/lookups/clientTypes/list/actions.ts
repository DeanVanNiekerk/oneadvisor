import { ClientType } from '../types';

type ClientTypeListReceiveAction = {
    type: "CLIENTTYPES_LIST_RECEIVE";
    payload: ClientType[];
};

export type ClientTypeListAction = ClientTypeListReceiveAction;

export const receiveClientTypes = (
    payload: ClientType[]
): ClientTypeListAction => ({
    type: "CLIENTTYPES_LIST_RECEIVE",
    payload,
});
