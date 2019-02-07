import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { contactsApi } from '@/config/api/member';

import { Contact } from '../types';

type ContactReceiveAction = {
    type: 'CONTACTS_CONTACT_RECEIVE';
    payload: Contact | null;
};
type ContactFetchingAction = {
    type: 'CONTACTS_CONTACT_FETCHING';
};
type ContactFetchingErrorAction = {
    type: 'CONTACTS_CONTACT_FETCHING_ERROR';
};

type ContactUpdatedAction = {
    type: 'CONTACTS_CONTACT_EDIT_RECEIVE';
};
type ContactUpdatingAction = {
    type: 'CONTACTS_CONTACT_EDIT_FETCHING';
};
type ContactUpdatingErrorAction = {
    type: 'CONTACTS_CONTACT_EDIT_FETCHING_ERROR';
};
type ContactValidationErrorAction = {
    type: 'CONTACTS_CONTACT_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type ContactAction =
    | ContactReceiveAction
    | ContactFetchingAction
    | ContactFetchingErrorAction
    | ContactUpdatedAction
    | ContactUpdatingAction
    | ContactUpdatingErrorAction
    | ContactValidationErrorAction;

export const receiveContact = (
    contact: Contact | null
): ContactReceiveAction => ({
    type: 'CONTACTS_CONTACT_RECEIVE',
    payload: contact
});

export const fetchContact = (contactId: string): ApiAction => ({
    type: 'API',
    endpoint: `${contactsApi}/${contactId}`,
    dispatchPrefix: 'CONTACTS_CONTACT'
});

export const updateContact = (
    contact: Contact,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${contactsApi}/${contact.id}`,
    method: 'POST',
    payload: contact,
    onSuccess: onSuccess,
    dispatchPrefix: 'CONTACTS_CONTACT_EDIT'
});

export const insertContact = (
    contact: Contact,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${contactsApi}`,
    method: 'POST',
    payload: contact,
    onSuccess: onSuccess,
    dispatchPrefix: 'CONTACTS_CONTACT_EDIT'
});

export const deleteContact = (
    contactId: string,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${contactsApi}/${contactId}`,
    method: 'DELETE',
    onSuccess: onSuccess
});
