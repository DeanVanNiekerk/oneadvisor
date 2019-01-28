import { Popconfirm } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import {
    Contact, contactsSelector, deleteContact, fetchContact, fetchContacts, receiveContact
} from '@/state/app/member/contacts';
import { RootState } from '@/state/rootReducer';
import { ContactTypeName, StopPropagation, Table } from '@/ui/controls';

import EditContact from './EditContact';

type Props = {
    memberId: string;
    contacts: Contact[];
    fetching: boolean;
    onSave?: () => void;
} & DispatchProp;

class ContactList extends Component<Props> {
    componentDidMount() {
        this.loadContacts();
    }

    loadContacts = () => {
        this.props.dispatch(receiveContact(null));
        const filters = {
            memberId: [this.props.memberId]
        };

        this.props.dispatch(fetchContacts(filters));
    };

    onSave = () => {
        this.loadContacts();
        if (this.props.onSave) this.props.onSave();
    };

    editContact = (id: string) => {
        this.props.dispatch(fetchContact(id));
    };

    deleteContact = (id: string) => {
        this.props.dispatch(deleteContact(id, this.onSave));
    };

    getColumns = () => {
        return [
            getColumn('contactTypeId', 'Type', {
                render: (contactTypeId: string) => {
                    return <ContactTypeName contactTypeId={contactTypeId} />;
                }
            }),
            getColumn('value', 'Value'),
            getColumn('id', 'Actions', {
                render: (id: string) => {
                    return (
                        <StopPropagation>
                            <Popconfirm
                                title="Are you sure remove this contact?"
                                onConfirm={() => this.deleteContact(id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a href="#">Remove</a>
                            </Popconfirm>
                        </StopPropagation>
                    );
                }
            })
        ];
    };

    render() {
        return (
            <>
                <EditContact
                    memberId={this.props.memberId}
                    onSave={this.onSave}
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
