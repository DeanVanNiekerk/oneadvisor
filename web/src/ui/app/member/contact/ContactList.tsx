import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import { Contact, contactsSelector, fetchContact, fetchContacts, receiveContact } from '@/state/app/member/contacts';
import { RootState } from '@/state/rootReducer';
import { Button, Header, Table } from '@/ui/controls';

//import EditPolicy from './EditPolicy';

type Props = {
    memberId: string;
    contacts: Contact[];
    fetching: boolean;
} & DispatchProp;

class ContactList extends Component<Props> {
    componentDidMount() {
        this.loadContacts();
    }

    loadContacts = () => {
        const filters = {
            memberId: [this.props.memberId]
        };

        this.props.dispatch(fetchContacts(filters));
    };

    editContact = (id: string) => {
        this.props.dispatch(fetchContact(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadContacts();
    };

    newContact = () => {
        const contact: Contact = {
            id: '',
            memberId: this.props.memberId,
            contactTypeId: '',
            value: ''
        };
        this.props.dispatch(receiveContact(contact));
    };

    getColumns = () => {
        return [
            getColumn('contactTypeId', 'Type'),
            getColumn('value', 'Value')
        ];
    };

    render() {
        return (
            <>
                <Header
                    className="mb-1"
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="sync"
                                onClick={this.loadContacts}
                                disabled={this.props.fetching}
                            >
                                Reload
                            </Button>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newContact}
                                disabled={this.props.fetching}
                                requiredUseCase="mem_edit_contacts"
                            >
                                New Contact
                            </Button>
                        </>
                    }
                />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.contacts}
                    loading={this.props.fetching}
                    onRowClick={contact => this.editContact(contact.id)}
                />
                {/* <EditPolicy onClose={this.onFormClose} /> */}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const contactsState = contactsSelector(state);

    return {
        contacts: contactsState.items,
        fetching: contactsState.fetching
    };
};

export default connect(mapStateToProps)(ContactList);
