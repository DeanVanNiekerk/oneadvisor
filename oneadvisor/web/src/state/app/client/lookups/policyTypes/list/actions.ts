import { PolicyType } from '../types';

type PolicyTypeListReceiveAction = {
    type: 'POLICYTYPES_LIST_RECEIVE';
    payload: PolicyType[];
};

export type PolicyTypeListAction = PolicyTypeListReceiveAction;

export const receivePolicyTypes = (
    payload: PolicyType[]
): PolicyTypeListAction => ({
    type: 'POLICYTYPES_LIST_RECEIVE',
    payload
});
