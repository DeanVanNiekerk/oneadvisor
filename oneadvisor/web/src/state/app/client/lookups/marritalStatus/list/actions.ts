import { MarritalStatus } from '../types';

type MarritalStatusListReceiveAction = {
    type: 'MARRITALSTATUS_LIST_RECEIVE';
    payload: MarritalStatus[];
};

export type MarritalStatusListAction = MarritalStatusListReceiveAction;

export const receiveMarritalStatus = (
    payload: MarritalStatus[]
): MarritalStatusListAction => ({
    type: 'MARRITALSTATUS_LIST_RECEIVE',
    payload
});
