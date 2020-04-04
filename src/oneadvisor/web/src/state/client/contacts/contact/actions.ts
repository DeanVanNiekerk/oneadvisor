import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, Result, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { contactsApi } from "@/config/api/client";
import { RootState } from "@/state";

import { contactIsModifiedSelector, contactSelector } from "../";
import { ContactEdit } from "../types";

type ContactReceiveAction = {
    type: "CONTACTS_CONTACT_RECEIVE";
    payload: ContactEdit | null;
};
type ContactModifiedAction = {
    type: "CONTACTS_CONTACT_MODIFIED";
    payload: ContactEdit | null;
};
type ContactVisibleAction = {
    type: "CONTACTS_CONTACT_VISIBLE";
    payload: boolean;
};
type ContactFetchingAction = {
    type: "CONTACTS_CONTACT_FETCHING";
};
type ContactFetchingErrorAction = {
    type: "CONTACTS_CONTACT_FETCHING_ERROR";
};
type ContactUpdatedAction = {
    type: "CONTACTS_CONTACT_EDIT_RECEIVE";
};
type ContactUpdatingAction = {
    type: "CONTACTS_CONTACT_EDIT_FETCHING";
};
type ContactUpdatingErrorAction = {
    type: "CONTACTS_CONTACT_EDIT_FETCHING_ERROR";
};
type ContactValidationErrorAction = {
    type: "CONTACTS_CONTACT_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type ContactAction =
    | ContactModifiedAction
    | ContactVisibleAction
    | ContactReceiveAction
    | ContactFetchingAction
    | ContactFetchingErrorAction
    | ContactUpdatedAction
    | ContactUpdatingAction
    | ContactUpdatingErrorAction
    | ContactValidationErrorAction;

export const receiveContact = (contact: ContactEdit | null): ContactReceiveAction => ({
    type: "CONTACTS_CONTACT_RECEIVE",
    payload: contact,
});

export const fetchContact = (contactId: string): ApiAction => ({
    type: "API",
    endpoint: `${contactsApi}/${contactId}`,
    dispatchPrefix: "CONTACTS_CONTACT",
});

export const modifyContact = (contact: ContactEdit): ContactModifiedAction => ({
    type: "CONTACTS_CONTACT_MODIFIED",
    payload: contact,
});

export const contactVisible = (visible: boolean): ContactVisibleAction => ({
    type: "CONTACTS_CONTACT_VISIBLE",
    payload: visible,
});

export const clearContact = (): ContactReceiveAction => receiveContact(null);

export const saveContact = (
    onSaved?: (contact: ContactEdit) => void
): ThunkAction<void, RootState, {}, ContactReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { contact } = contactSelector(getState());
        if (!contact) return;

        const onSuccess = (contactEdit: ContactEdit) => {
            dispatch(clearContact());
            if (onSaved) onSaved(contactEdit);
        };

        if (contact.id) {
            dispatch(
                updateContact(contact, () => {
                    onSuccess(contact);
                })
            );
        } else {
            dispatch(
                insertContact(contact, (result) => {
                    onSuccess(result.tag);
                })
            );
        }
    };
};

export const confirmCancelContact = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, ContactReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = contactIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearContact());
            onCancelled();
        };

        if (modifed)
            return showConfirm({
                onOk: () => {
                    cancel();
                },
            });

        cancel();
    };
};

export const updateContact = (contact: ContactEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${contactsApi}/${contact.id}`,
    method: "POST",
    payload: contact,
    onSuccess: onSuccess,
    dispatchPrefix: "CONTACTS_CONTACT_EDIT",
});

export const insertContact = (
    contact: ContactEdit,
    onSuccess: ApiOnSuccess<Result<ContactEdit>>
): ApiAction => ({
    type: "API",
    endpoint: `${contactsApi}`,
    method: "POST",
    payload: contact,
    onSuccess: onSuccess,
    dispatchPrefix: "CONTACTS_CONTACT_EDIT",
});

export const deleteContact = (contactId: string, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${contactsApi}/${contactId}`,
    method: "DELETE",
    onSuccess: onSuccess,
});
