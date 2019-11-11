import { Popconfirm } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { getColumnDefinition } from "@/app/table";
import {
    Contact,
    contactsSelector,
    deleteContact,
    fetchContact,
    fetchContacts,
    receiveContact,
} from "@/state/app/client/contacts";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { ContactTypeName, getTable, StopPropagation } from "@/ui/controls";

import EditContact from "./EditContact";

const Table = getTable<Contact>();

type Props = {
    clientId: string;
    contacts: Contact[];
    fetching: boolean;
    onSave?: () => void;
    useCases: string[];
} & DispatchProp;

class ContactList extends Component<Props> {
    componentDidMount() {
        this.loadContacts();
    }

    loadContacts = () => {
        this.props.dispatch(receiveContact(null));
        const filters = {
            clientId: [this.props.clientId],
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
        const getColumn = getColumnDefinition<Contact>();

        return [
            getColumn(
                "contactTypeId",
                "Type",
                {},
                {
                    render: (contactTypeId: string) => {
                        return <ContactTypeName contactTypeId={contactTypeId} />;
                    },
                }
            ),
            getColumn("value", "Value"),
            getColumn(
                "id",
                "Actions",
                {},
                {
                    render: (id: string) => {
                        return (
                            <StopPropagation>
                                {hasUseCase("clt_edit_contacts", this.props.useCases) && (
                                    <Popconfirm
                                        title="Are you sure remove this contact?"
                                        onConfirm={() => this.deleteContact(id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <a href="#">Remove</a>
                                    </Popconfirm>
                                )}
                            </StopPropagation>
                        );
                    },
                }
            ),
        ];
    };

    render() {
        return (
            <>
                <EditContact clientId={this.props.clientId} onSave={this.onSave} />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.contacts}
                    loading={this.props.fetching}
                    onRowClick={contact => this.editContact(contact.id)}
                    onRowClickRequiredUseCase="clt_edit_contacts"
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const contactsState = contactsSelector(state);

    return {
        contacts: contactsState.items,
        fetching: contactsState.fetching,
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(ContactList);
