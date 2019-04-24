import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { Contact } from '@/state/app/client/contacts';
import { ContactType, contactTypesSelector } from '@/state/app/client/lookups';
import { RootState } from '@/state/rootReducer';
import { Button, Form, FormField, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    contact: Contact;
    contactTypes: ContactType[];
    validationResults: ValidationResult[];
    onSave: (contact: Contact) => void;
    onCancel: () => void;
};

type State = {
    contact: Contact;
};

class ContactForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            contact: props.contact,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.contact != prevProps.contact)
            this.setState({
                contact: this.props.contact,
            });
    }

    handleChange = (fieldName: keyof Contact, value: string) => {
        const contact = {
            ...this.state.contact,
            [fieldName]: value,
        };
        this.setState({
            contact: contact,
        });
    };

    render() {
        const { validationResults } = this.props;
        const { contact } = this.state;

        return (
            <Form className="my-1" layout="inline">
                <FormInput
                    fieldName="value"
                    label="Value"
                    value={contact.value}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormSelect
                    fieldName="contactTypeId"
                    label="Type"
                    value={contact.contactTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.contactTypes}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormField className="mr-0">
                    <Button onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>
                </FormField>
                <FormField>
                    <Button
                        onClick={() => this.props.onSave(this.state.contact)}
                        type="primary"
                    >
                        {this.props.contact.id
                            ? "Update Contact"
                            : "Add Contact"}
                    </Button>
                </FormField>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        contactTypes: contactTypesSelector(state).items,
    };
};

export default connect(mapStateToProps)(ContactForm);
