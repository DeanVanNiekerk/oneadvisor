import { Popconfirm } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { hasUseCase } from "@/app/identity";
import { getColumnDefinition } from "@/app/table";
import { useCaseSelector } from "@/state/auth";
import {
    clearContact,
    Contact,
    contactsSelector,
    contactVisible,
    deleteContact,
    fetchContact,
    fetchContacts,
} from "@/state/client/contacts";
import { RootState } from "@/state/rootReducer";
import { ContactTypeName, getTable, StopPropagation } from "@/ui/controls";

import EditContact from "./EditContact";

const Table = getTable<Contact>();

type Props = {
    clientId: string;
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const ContactList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchContacts(props.clientId);
    }, [props.clientId]);

    const onSaved = () => {
        if (props.onSaved) props.onSaved();
        props.fetchContacts(props.clientId);
    };

    return (
        <>
            <EditContact clientId={props.clientId} onSaved={onSaved} />
            <Table
                rowKey="id"
                columns={getColumns(props)}
                dataSource={props.contacts}
                loading={props.fetching}
                onRowClick={(contact) => props.editContact(contact.id)}
                onRowClickRequiredUseCase="clt_edit_contacts"
            />
        </>
    );
};

const getColumns = (props: Props) => {
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
                            {hasUseCase("clt_edit_contacts", props.useCases) && (
                                <Popconfirm
                                    title="Are you sure remove this contact?"
                                    onConfirm={() =>
                                        props.deleteContact(props.clientId, id, props.onSaved)
                                    }
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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const contactsState = contactsSelector(state);

    return {
        contacts: contactsState.items,
        fetching: contactsState.fetching,
        useCases: useCaseSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        fetchContacts: (clientId: string) => {
            const filters = { clientId: [clientId] };
            dispatch(fetchContacts(filters));
            dispatch(clearContact());
            dispatch(contactVisible(false));
        },
        deleteContact: (clientId: string, contactId: string, onDeleted?: () => void) => {
            dispatch(
                deleteContact(contactId, () => {
                    if (onDeleted) onDeleted();

                    const filters = { clientId: [clientId] };
                    dispatch(fetchContacts(filters));
                })
            );
        },
        editContact: (contactId: string) => {
            dispatch(fetchContact(contactId));
            dispatch(contactVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactList);
