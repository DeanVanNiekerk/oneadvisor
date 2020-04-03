import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    confirmCancelContact,
    ContactEdit,
    contactSelector,
    contactVisible,
    modifyContact,
    saveContact,
} from "@/state/client/contacts";
import { contactTypesSelector } from "@/state/client/lookups";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormField, FormInput, FormSelect } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

type Props = {
    onSaved?: (contact: ContactEdit) => void;
} & PropsFromState &
    PropsFromDispatch;

const ContactForm: React.FC<Props> = (props: Props) => {
    const { contact, validationResults } = props;

    if (!contact) return <React.Fragment />;

    const close = () => props.setVisible(false);

    const onChange = (fieldName: keyof ContactEdit, value: string) => {
        props.handleChange(contact, fieldName, value);
    };

    return (
        <Form className="my-1" layout="inline">
            <FormInput
                fieldName="value"
                label="Value"
                value={contact.value}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormSelect
                fieldName="contactTypeId"
                label="Type"
                value={contact.contactTypeId}
                onChange={onChange}
                validationResults={validationResults}
                options={props.contactTypes}
                optionsValue="id"
                optionsText="name"
            />
            <FormField className="mr-0">
                <Button
                    onClick={() => {
                        props.confirmCancel(close);
                    }}
                >
                    Cancel
                </Button>
            </FormField>
            <FormField>
                <Button
                    onClick={() => {
                        props.saveContact(props.onSaved);
                    }}
                    type="primary"
                >
                    {contact.id ? "Update Contact" : "Add Contact"}
                </Button>
            </FormField>
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const contactState = contactSelector(state);
    return {
        contact: contactState.contact,
        validationResults: contactState.validationResults,
        contactTypes: contactTypesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (contact: ContactEdit, fieldName: keyof ContactEdit, value: string) => {
            const contactModified = update(contact, { [fieldName]: { $set: value } });
            dispatch(modifyContact(contactModified));
        },
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelContact(showConfirm, onCancelled));
        },
        saveContact: (onSaved?: (contact: ContactEdit) => void) => {
            dispatch(
                saveContact((contactSaved: ContactEdit) => {
                    if (onSaved) onSaved(contactSaved);
                    dispatch(contactVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(contactVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
