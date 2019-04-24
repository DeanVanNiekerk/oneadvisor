import { Popconfirm } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import {
    Allocation, allocationsSelector, deleteAllocation, fetchAllocation, fetchAllocations, receiveAllocation
} from '@/state/app/commission/allocations';
import { RootState } from '@/state/rootReducer';
import { Button, Header, StopPropagation, Table } from '@/ui/controls';

import EditAllocation from './EditAllocation';

type Props = {
    clientId: string;
    allocations: Allocation[];
    fetching: boolean;
    onSave?: () => void;
} & DispatchProp;

class AllocationList extends Component<Props> {
    componentDidMount() {
        this.loadAllocations();
    }

    loadAllocations = () => {
        this.props.dispatch(receiveAllocation(null));
        const filters = {
            toClientId: [this.props.clientId],
        };

        this.props.dispatch(fetchAllocations(filters));
    };

    onClose = (cancelled: boolean = false) => {
        if (!cancelled) {
            this.loadAllocations();
            if (this.props.onSave) this.props.onSave();
        }
    };

    newAllocation = () => {
        this.props.dispatch(
            receiveAllocation({
                id: "",
                toClientId: this.props.clientId,
                fromClientId: "",
                policyIds: [],
            })
        );
    };

    editAllocation = (id: string) => {
        this.props.dispatch(fetchAllocation(id));
    };

    deleteAllocation = (id: string) => {
        this.props.dispatch(deleteAllocation(id, this.onClose));
    };

    getColumns = () => {
        return [
            getColumn("fromClientId", "Client"),
            getColumn("policyIds", "Policies"),
            getColumn("id", "Actions", {
                render: (id: string) => {
                    return (
                        <StopPropagation>
                            <a
                                href="#"
                                className="mr-1"
                                onClick={() => this.editAllocation(id)}
                            >
                                Edit
                            </a>
                            <Popconfirm
                                title="Are you sure remove this allocation?"
                                onConfirm={() => this.deleteAllocation(id)}
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

    render() {
        return (
            <>
                <Header
                    className="mb-1"
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newAllocation}
                                disabled={this.props.fetching}
                                requiredUseCase="com_edit_commission_allocations"
                            >
                                New Allocation
                            </Button>
                        </>
                    }
                    icon={!this.props.clientId ? "file-text" : ""}
                />
                <EditAllocation onClose={this.onClose} />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.allocations}
                    loading={this.props.fetching}
                    onRowClick={allocation =>
                        this.editAllocation(allocation.id)
                    }
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const allocationsState = allocationsSelector(state);

    return {
        allocations: allocationsState.items,
        fetching: allocationsState.fetching,
    };
};

export default connect(mapStateToProps)(AllocationList);
