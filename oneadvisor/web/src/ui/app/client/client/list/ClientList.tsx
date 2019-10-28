import { Popconfirm } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch } from "redux";

import { hasUseCase } from "@/app/identity";
import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { areEqual } from "@/app/utils";
import {
    clearClientPreview, Client, clientMergeReset, clientsSelector, deleteClient, fetchClients, fetchMergeClients,
    newClient, receiveFilters, receivePageOptions, receiveSelectedClients, receiveSortOptions
} from "@/state/app/client/clients";
import { clientTypesSelector } from "@/state/app/client/lookups";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, ClientTypeIcon, getTable, Header, StopPropagation } from "@/ui/controls";

import ClientMerge from "../../merge/ClientMerge";
import EditClient from "../form/EditClient";

const Table = getTable<Client>();

type Props = PropsFromState & PropsFromDispatch & RouteComponentProps;

const ClientList: React.FC<Props> = props => {
    useEffect(() => {
        props.fetchClients();
    }, [props.pageOptions, props.sortOptions, props.filters]);

    const editClient = (id: string) => {
        props.clearClientPreview();
        props.history.push(`/client/clients/${id}`);
    };

    const getColumns = () => {
        var getColumn = getColumnDefinition<Client>(true, props.filters, props.sortOptions);

        return [
            getColumn(
                "clientTypeId",
                "Type",
                {},
                {
                    width: "110px",
                    align: "center",
                    render: (clientTypeId: string) => {
                        return <ClientTypeIcon clientTypeId={clientTypeId} />;
                    },
                    filters: props.clientTypes.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("lastName", "Last Name", {
                showSearchFilter: true,
            }),
            getColumn("firstName", "First Name", { showSearchFilter: true }),
            getColumn("idNumber", "ID Number", { showSearchFilter: true }),
            getColumn("dateOfBirth", "Date of Birth", { type: "date" }),
            getColumn(
                "id",
                "Actions",
                {},
                {
                    render: (id: string) => {
                        return (
                            <StopPropagation>
                                {hasUseCase("clt_edit_clients", props.useCases) && (
                                    <Popconfirm
                                        title="Are you sure remove this client?"
                                        onConfirm={() => props.deleteClient(id, props.fetchClients)}
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

    const onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (!areEqual(props.pageOptions, pageOptions)) props.updatePageOptions(pageOptions);
        if (!areEqual(props.sortOptions, sortOptions)) props.updateSortOptions(sortOptions);
        if (!areEqual(props.filters, filters)) props.updateFilters(filters);
    };

    return (
        <>
            <Header
                icon="user"
                actions={
                    <>
                        <Button
                            type="primary"
                            icon="fork"
                            onClick={() => props.mergeClients(props.selectedClientIds)}
                            visible={props.selectedClientIds.length > 1}
                            requiredUseCase="clt_edit_clients"
                        >
                            Merge
                        </Button>
                        <Button
                            type="primary"
                            icon="delete"
                            onClick={() => props.updateSelectedClients([])}
                            visible={props.selectedClientIds.length > 0}
                        >
                            Clear All Selected
                        </Button>
                        <Button
                            type="default"
                            icon="plus"
                            onClick={props.newClient}
                            disabled={props.fetching}
                            requiredUseCase="clt_edit_clients"
                        >
                            New Client
                        </Button>
                    </>
                }
            >
                Clients
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.clients}
                loading={props.fetching}
                onRowClick={client => editClient(client.id)}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
                rowSelection={{
                    onChange: props.updateSelectedClients,
                    selectedRowKeys: props.selectedClientIds,
                }}
            />
            <EditClient onSaved={props.fetchClients} />
            <ClientMerge onMerged={props.fetchClients} />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const clientsState = clientsSelector(state);
    const clientTypesState = clientTypesSelector(state);

    return {
        clients: clientsState.items,
        fetching: clientsState.fetching,
        pageOptions: clientsState.pageOptions,
        sortOptions: clientsState.sortOptions,
        totalItems: clientsState.totalItems,
        filters: clientsState.filters,
        selectedClientIds: clientsState.selectedClientIds,
        clientTypes: clientTypesState.items,
        useCases: useCaseSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ fetchClients, newClient, clearClientPreview }, dispatch),
        updatePageOptions: (pageOptions: PageOptions) => {
            dispatch(receivePageOptions(pageOptions));
        },
        updateSortOptions: (sortOptions: SortOptions) => {
            dispatch(receiveSortOptions(sortOptions));
        },
        updateFilters: (filters: Filters) => {
            dispatch(receiveFilters(filters));
        },
        updateSelectedClients: (selectedClientIds: string[]) => {
            dispatch(receiveSelectedClients(selectedClientIds));
        },
        deleteClient: (id: string, onDeleted: () => void) => {
            dispatch(deleteClient(id, onDeleted));
        },
        mergeClients: (clientIds: string[]) => {
            dispatch(clientMergeReset());
            dispatch(fetchMergeClients(clientIds));
        },
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ClientList)
);
