import { ContactType } from '../types';

type ContactTypeListReceiveAction = {
    type: 'CONTACTTYPES_LIST_RECEIVE';
    payload: ContactType[];
};

export type ContactTypeListAction = ContactTypeListReceiveAction;

export const receiveContactTypes = (
    payload: ContactType[]
): ContactTypeListAction => ({
    type: 'CONTACTTYPES_LIST_RECEIVE',
    payload
});
