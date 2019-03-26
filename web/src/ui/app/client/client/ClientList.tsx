import { Popconfirm } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import {
    Client, ClientEdit, clientMergeReset, clientsSelector, deleteClient, fetchClients, fetchMergeClients, newClient,
    receiveClient, receiveClientPreview, receiveFilters, receivePageOptions, receiveSelectedClients, receiveSortOptions
} from '@/state/app/client/clients';
import { RootState } from '@/state/rootReducer';
import { Button, Header, StopPropagation, Table } from '@/ui/controls';

import ClientMerge from '../merge/ClientMerge';
import EditClient from './EditClient';

type Props = {
    clients: Client[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    selectedClientIds: string[];
} & RouteComponentProps &
    DispatchProp;

type State = {
    clientEditVisible: boolean;
    clientMergeVisible: boolean;
};

class ClientList extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            clientEditVisible: false,
            clientMergeVisible: false,
        };
    }

    componentDidMount() {
        this.loadClients();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadClients();
    }

    loadClients = () => {
        this.props.dispatch(
            fetchClients(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    editClient = (id: string) => {
        this.props.dispatch(receiveClientPreview(null));
        this.props.history.push(`/client/clients/${id}`);
    };

    deleteClient = (id: string) => {
        this.props.dispatch(deleteClient(id, this.loadClients));
    };

    onDataChange = (cancelled: boolean) => {
        if (!cancelled) this.loadClients();
    };

    newClient = () => {
        const client: ClientEdit = newClient();
        this.props.dispatch(receiveClient(client));
        this.toggleClientEditVisible();
    };

    getColumns = () => {
        return [
            getColumnEDS("lastName", "Last Name", { showSearchFilter: true }),
            getColumnEDS("firstName", "First Name", { showSearchFilter: true }),
            getColumnEDS("idNumber", "ID Number", { showSearchFilter: true }),
            getColumnEDS("dateOfBirth", "Date of Birth", { type: "date" }),
            getColumnEDS("id", "Actions", {
                render: (id: string) => {
                    return (
                        <StopPropagation>
                            <a
                                href="#"
                                className="mr-1"
                                onClick={() => this.editClient(id)}
                            >
                                Edit
                            </a>
                            <Popconfirm
                                title="Are you sure remove this client?"
                                onConfirm={() => this.deleteClient(id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a href="#">Remove</a>
                            </Popconfirm>
                        </StopPropagation>
                    );
                },
            }),
        ];
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["firstName", "lastName", "idNumber"]);
    };

    onTableChange = (
        pageOptions: PageOptions,
        sortOptions: SortOptions,
        filters: Filters
    ) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters)
            this.props.dispatch(receiveFilters(this.updateFilters(filters)));
    };

    onClientSelected = (selectedClientIds: string[]) => {
        this.props.dispatch(receiveSelectedClients(selectedClientIds));
    };

    toggleClientEditVisible = () => {
        this.setState({
            clientEditVisible: !this.state.clientEditVisible,
        });
    };

    closeClientEdit = (cancelled: boolean) => {
        this.onDataChange(cancelled);
        this.toggleClientEditVisible();
    };

    toggleClientMergeVisible = () => {
        this.setState({
            clientMergeVisible: !this.state.clientMergeVisible,
        });
    };

    closeClientMerge = (cancelled: boolean) => {
        this.onDataChange(cancelled);
        this.toggleClientMergeVisible();
    };

    openClientMerge = () => {
        this.props.dispatch(clientMergeReset());
        this.props.dispatch(fetchMergeClients(this.props.selectedClientIds));
        this.toggleClientMergeVisible();
    };

    clearAllSelectedClients = () => {
        this.props.dispatch(receiveSelectedClients([]));
    };

    render() {
        return (
            <>
                <Header
                    icon="user"
                    actions={
                        <>
                            <Button
                                type="primary"
                                icon="fork"
                                onClick={this.openClientMerge}
                                visible={
                                    this.props.selectedClientIds.length > 1
                                }
                                requiredUseCase="clt_edit_clients"
                            >
                                Merge
                            </Button>
                            <Button
                                type="primary"
                                icon="delete"
                                onClick={this.clearAllSelectedClients}
                                visible={
                                    this.props.selectedClientIds.length > 0
                                }
                            >
                                Clear All Selected
                            </Button>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newClient}
                                disabled={this.props.fetching}
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
                    columns={this.getColumns()}
                    dataSource={this.props.clients}
                    loading={this.props.fetching}
                    onRowClick={client => this.editClient(client.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    rowSelection={{
                        onChange: this.onClientSelected,
                        selectedRowKeys: this.props.selectedClientIds,
                    }}
                />
                <EditClient
                    onClose={this.closeClientEdit}
                    visible={this.state.clientEditVisible}
                />
                <ClientMerge
                    onClose={this.closeClientMerge}
                    visible={this.state.clientMergeVisible}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientsState = clientsSelector(state);

    return {
        clients: clientsState.items,
        fetching: clientsState.fetching,
        pageOptions: clientsState.pageOptions,
        sortOptions: clientsState.sortOptions,
        totalItems: clientsState.totalItems,
        filters: clientsState.filters,
        selectedClientIds: clientsState.selectedClientIds,
    };
};

export default withRouter(connect(mapStateToProps)(ClientList));
