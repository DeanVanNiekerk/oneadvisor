import { Col, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ValidationResult } from '@/app/validation';
import { Branch, branchSelector, insertBranch, receiveBranch, updateBranch } from '@/state/app/directory/branches';
import { Contact, contactSelector, insertContact, receiveContact, updateContact } from '@/state/app/member/contacts';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Form, FormField } from '@/ui/controls';

import ContactForm from './ContactForm';

type Props = {
    contact: Contact | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
    memberId: string;
    onSave: () => void;
} & RouteComponentProps &
    DispatchProp;

class EditContact extends Component<Props> {
    save = (contact: Contact) => {
        if (contact.id) {
            this.props.dispatch(updateContact(contact, this.props.onSave));
        } else {
            this.props.dispatch(insertContact(contact, this.props.onSave));
        }
    };

    cancel = () => {
        this.props.dispatch(receiveBranch(null));
    };

    newContact = () => {
        this.props.dispatch(
            receiveContact({
                id: '',
                memberId: this.props.memberId,
                contactTypeId: '',
                value: ''
            })
        );
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    render() {
        const { contact, validationResults } = this.props;

        return (
            <ContentLoader isLoading={this.isLoading()}>
                {contact && (
                    <ContactForm
                        contact={contact}
                        validationResults={validationResults}
                        onSave={this.save}
                        onCancel={this.cancel}
                    />
                )}
                {!contact && (
                    <Form layout="inline">
                        <FormField>
                            <Button
                                icon="plus"
                                type="dashed"
                                onClick={this.newContact}
                                noLeftMargin={true}
                                requiredUseCase="mem_edit_contacts"
                            >
                                Add Contact
                            </Button>
                        </FormField>
                    </Form>
                )}
            </ContentLoader>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const contactState = contactSelector(state);

    return {
        contact: contactState.contact,
        fetching: contactState.fetching,
        updating: contactState.updating,
        validationResults: contactState.validationResults
    };
};

export default withRouter(connect(mapStateToProps)(EditContact));
