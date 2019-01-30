import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import {
    CommissionType, commissionTypesSelector, fetchCommissionTypes, receiveCommissionType
} from '@/state/app/directory/lookups/commissionTypes';
import { RootState } from '@/state/rootReducer';
import { Button, Header, PolicyTypeName, Table } from '@/ui/controls';

import EditCommissionType from './EditCommissionType';

type Props = {
    commissionTypes: CommissionType[];
    fetching: boolean;
    error: boolean;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class CommissionTypeList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        if (this.props.commissionTypes.length === 0) this.loadCommissionTypes();
    }

    loadCommissionTypes = () => {
        this.props.dispatch(fetchCommissionTypes());
    };

    newCommissionType = () => {
        const commissionType = {
            id: '',
            policyTypeId: '',
            name: '',
            code: ''
        };
        this.showEditCommissionType(commissionType);
    };

    editCommissionType = (id: string) => {
        const commissionType = this.props.commissionTypes.find(
            u => u.id === id
        );
        if (commissionType) this.showEditCommissionType(commissionType);
    };

    showEditCommissionType = (commissionType: CommissionType) => {
        this.props.dispatch(receiveCommissionType(commissionType));
        this.setState({
            editVisible: true
        });
    };

    closeEditCommissionType = (cancelled: boolean) => {
        this.setState({
            editVisible: false
        });
        if (!cancelled) this.loadCommissionTypes();
    };

    getColumns = () => {
        return [
            getColumn('name', 'Name', { showSearchFilter: true }),
            getColumn('code', 'Code', { showSearchFilter: true }),
            getColumn('policyTypeId', 'Policy Type', {
                render: (policyTypeId: string) => {
                    return <PolicyTypeName policyTypeId={policyTypeId} />;
                }
            })
        ];
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newCommissionType}
                            disabled={this.props.fetching}
                            requiredUseCase="dir_edit_lookups"
                        >
                            New Commission Type
                        </Button>
                    }
                >
                    Commission Types
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.commissionTypes}
                    loading={this.props.fetching}
                    onRowClick={org => this.editCommissionType(org.id)}
                />
                <EditCommissionType
                    visible={this.state.editVisible}
                    onClose={this.closeEditCommissionType}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionTypesState = commissionTypesSelector(state);

    return {
        commissionTypes: commissionTypesState.items,
        fetching: commissionTypesState.fetching,
        error: commissionTypesState.error
    };
};

export default connect(mapStateToProps)(CommissionTypeList);
