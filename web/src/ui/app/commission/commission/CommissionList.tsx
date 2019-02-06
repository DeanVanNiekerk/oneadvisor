import { Col, Row, Statistic } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import {
    Commission, CommissionEdit, commissionsSelector, fetchCommission, fetchCommissions, receiveCommission,
    receiveFilters, receivePageOptions, receiveSortOptions
} from '@/state/app/commission/commissions';
import { CommissionType, commissionTypesSelector } from '@/state/app/directory/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Button, CommissionTypeName, Header, Table, UserName } from '@/ui/controls';

import EditCommission from './EditCommission';

type Props = {
    commissionStatementId: string;
    commissions: Commission[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    sumAmountIncludingVAT: number;
    sumVAT: number;
    averageAmountIncludingVAT: number;
    averageVAT: number;
    filters: Filters;
    users: UserSimple[];
    commissionTypes: CommissionType[];
    onCommissionsUpdate: () => void;
} & DispatchProp;

class CommissionList extends Component<Props> {
    componentDidMount() {
        this.loadCommissions();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadCommissions();
    }

    loadCommissions = () => {
        const filters = {
            ...this.props.filters,
            commissionStatementId: [this.props.commissionStatementId]
        };
        this.props.dispatch(
            fetchCommissions(
                this.props.pageOptions,
                this.props.sortOptions,
                filters
            )
        );
    };

    editCommission = (id: string) => {
        this.props.dispatch(fetchCommission(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) {
            this.loadCommissions();
            this.props.onCommissionsUpdate();
        }
    };

    newCommission = () => {
        const commission: CommissionEdit = {
            id: '',
            commissionStatementId: this.props.commissionStatementId,
            amountIncludingVAT: 0,
            vat: 0,
            commissionTypeId: '',
            policyId: ''
        };
        this.props.dispatch(receiveCommission(commission));
    };

    getColumns = () => {
        return [
            getColumnEDS('policyNumber', 'Policy Number', {
                showSearchFilter: true
            }),
            getColumnEDS('commissionTypeId', 'Type', {
                render: (commissionTypeId: string) => {
                    return (
                        <CommissionTypeName
                            commissionTypeId={commissionTypeId}
                        />
                    );
                },
                filters: this.props.commissionTypes.map(type => ({
                    text: type.name,
                    value: type.id
                }))
            }),
            getColumnEDS('amountIncludingVAT', 'Amount (incl VAT)', {
                type: 'currency'
            }),
            getColumnEDS('vat', 'VAT', { type: 'currency' }),
            getColumnEDS('userId', 'Broker', {
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

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ['policyNumber']);
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
                                onClick={this.newCommission}
                                disabled={this.props.fetching}
                                requiredUseCase="com_edit_commissions"
                            >
                                New Commission
                            </Button>
                        </>
                    }
                />
                {/* <Row type="flex" justify="space-around" className="mb-1">
                    <Col>
                        <Statistic
                            title="Total Amount"
                            prefix="R"
                            value={this.props.sumAmountIncludingVAT}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Average Amount"
                            prefix="R"
                            value={this.props.averageAmountIncludingVAT}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Total VAT"
                            prefix="R"
                            value={this.props.sumVAT}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Average VAT"
                            prefix="R"
                            value={this.props.averageVAT}
                        />
                    </Col>
                </Row> */}
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.commissions}
                    loading={this.props.fetching}
                    onRowClick={commission =>
                        this.editCommission(commission.id)
                    }
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
                <EditCommission onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionsState = commissionsSelector(state);
    const usersState = usersSimpleSelector(state);
    const commissionTypesState = commissionTypesSelector(state);

    return {
        commissions: commissionsState.items,
        fetching: commissionsState.fetching,
        pageOptions: commissionsState.pageOptions,
        sortOptions: commissionsState.sortOptions,
        totalItems: commissionsState.totalItems,
        sumAmountIncludingVAT: commissionsState.sumAmountIncludingVAT,
        sumVAT: commissionsState.sumVAT,
        averageAmountIncludingVAT: commissionsState.averageAmountIncludingVAT,
        averageVAT: commissionsState.averageVAT,
        filters: commissionsState.filters,
        users: usersState.items,
        commissionTypes: commissionTypesState.items
    };
};

export default connect(mapStateToProps)(CommissionList);
