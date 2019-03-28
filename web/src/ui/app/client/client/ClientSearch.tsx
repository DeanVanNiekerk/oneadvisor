import { Icon, Input } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { getColumn } from '@/app/table';
import { Client, clientSearchSelector, searchClients } from '@/state/app/client/clients';
import { RootState } from '@/state/rootReducer';
import { Table } from '@/ui/controls';

type Props = {
    clients: Client[];
    fetching: boolean;
    onSelect: (clientId: string) => void;
    defaultSearchText?: string;
} & DispatchProp;

type State = {
    searchText: string;
};

class ClientSearch extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            searchText: props.defaultSearchText || "",
        };
    }

    componentDidMount() {
        this.loadClients();
    }

    loadClients = () => {
        let filters = {
            lastName: [this.state.searchText],
        };

        this.props.dispatch(searchClients(applyLike(filters, ["lastName"])));
    };

    selectClient = (id: string) => {
        this.props.onSelect(id);
    };

    onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: e.target.value }, this.loadClients);
    };

    getColumns = () => {
        return [
            getColumn("lastName", "Last Name", { sorter: false }),
            getColumn("firstName", "First Name", { sorter: false }),
            getColumn("idNumber", "ID Number", { sorter: false }),
            getColumn("dateOfBirth", "Date of Birth", {
                type: "date",
                sorter: false,
            }),
        ];
    };

    render() {
        const { searchText } = this.state;

        return (
            <>
                <Input
                    autoFocus={true}
                    size="large"
                    placeholder="Last Name"
                    prefix={<Icon type="search" />}
                    allowClear={true}
                    value={searchText}
                    onChange={this.onSearchChange}
                    className="mb-1"
                />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.clients}
                    loading={this.props.fetching}
                    onRowClick={client => this.selectClient(client.id)}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientsState = clientSearchSelector(state);

    return {
        clients: clientsState.items,
        fetching: clientsState.fetching,
    };
};

export default connect(mapStateToProps)(ClientSearch);
