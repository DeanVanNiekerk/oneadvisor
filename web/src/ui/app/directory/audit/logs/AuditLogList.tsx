import { Tag } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters, getColumn, PageOptions, SortOptions } from '@/app/table';
import {
    AuditLog, auditLogsSelector, fetchAuditLogs, receiveFilters, receivePageOptions, receiveSortOptions
} from '@/state/app/directory/audit';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Button, Header, Table, UserName } from '@/ui/controls';

import AuditLogDetails from './AuditLogDetails';

type Props = {
    logs: AuditLog[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    users: UserSimple[];
} & DispatchProp;

type State = {
    viewAuditLog: AuditLog | null;
};

class AuditLogList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            viewAuditLog: null
        };
    }

    componentDidMount() {
        if (this.props.logs.length === 0) this.loadAuditLogs();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadAuditLogs();
    }

    loadAuditLogs = () => {
        this.props.dispatch(
            fetchAuditLogs(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    viewAuditLog = (log: AuditLog) => {
        this.setState({
            viewAuditLog: log
        });
    };

    closeAuditLog = () => {
        this.setState({
            viewAuditLog: null
        });
    };

    getColumns = () => {
        return [
            getColumn('date', 'Date', { type: 'long-date' }),
            getColumn('entity', 'Entity', {
                render: (entity: string) => {
                    return entity.replace('Entity', '');
                },
                showSearchFilter: true
            }),
            getColumn('action', 'Action', {
                render: (action: string) => {
                    action = action.toUpperCase();
                    switch (action) {
                        case 'DELETE':
                            return <Tag color="red">{action}</Tag>;
                        case 'INSERT':
                            return <Tag color="green">{action}</Tag>;
                        default:
                            return <Tag color="blue">{action}</Tag>;
                    }
                },
                filters: [
                    {
                        text: 'Insert',
                        value: 'Insert'
                    },
                    {
                        text: 'Update',
                        value: 'Update'
                    },
                    {
                        text: 'Delete',
                        value: 'Delete'
                    }
                ]
            }),
            getColumn('userId', 'Broker', {
                render: (userId: string) => {
                    return <UserName userId={userId} />;
                },
                filters: this.props.users.map(user => ({
                    text: user.fullName,
                    value: user.id
                }))
            })
        ];
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
            this.props.dispatch(receiveFilters(filters));
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="sync"
                                onClick={this.loadAuditLogs}
                                disabled={this.props.fetching}
                            >
                                Reload
                            </Button>
                        </>
                    }
                >
                    Audit Logs
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.logs}
                    loading={this.props.fetching}
                    onRowClick={auditLog => this.viewAuditLog(auditLog)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
                <AuditLogDetails
                    visible={this.state.viewAuditLog !== null}
                    onClose={this.closeAuditLog}
                    auditLog={this.state.viewAuditLog}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const auditLogsState = auditLogsSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        logs: auditLogsState.items,
        fetching: auditLogsState.fetching,
        pageOptions: auditLogsState.pageOptions,
        sortOptions: auditLogsState.sortOptions,
        totalItems: auditLogsState.totalItems,
        filters: auditLogsState.filters,
        users: usersState.items
    };
};

export default connect(mapStateToProps)(AuditLogList);
