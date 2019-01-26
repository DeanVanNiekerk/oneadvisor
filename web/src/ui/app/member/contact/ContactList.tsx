import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import { Contact, contactsSelector, fetchContact, fetchContacts, receiveContact } from '@/state/app/member/contacts';
import { RootState } from '@/state/rootReducer';
import { Button, Header, Table } from '@/ui/controls';

import EditContact from './EditContact';

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

    getColumns = () => {
        return [
            getColumn('contactTypeId', 'Type'),
            getColumn('value', 'Value')
        ];
    };

    render() {
        return (
            <>
                <EditContact
                    memberId={this.props.memberId}
                    onSave={this.loadContacts}
                />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.contacts}
                    loading={this.props.fetching}
                    onRowClick={contact => this.editContact(contact.id)}
                />
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
