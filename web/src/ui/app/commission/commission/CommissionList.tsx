import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters, getColumn, PageOptions, SortOptions } from '@/app/table';
import {
    Commission, CommissionEdit, commissionsSelector, fetchCommission, fetchCommissions, receiveCommission,
    receiveFilters, receivePageOptions, receiveSortOptions
} from '@/state/app/commission/commissions';
import { RootState } from '@/state/rootReducer';
import { Button, CommissionTypeName, Header, Table, UserName } from '@/ui/controls';

import EditCommission from './EditCommission';
import { Statistic, Row, Col } from 'antd';

type Props = {
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
        this.props.dispatch(
            fetchCommissions(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    editCommission = (id: string) => {
        this.props.dispatch(fetchCommission(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadCommissions();
    };

    newCommission = () => {
        const commission: CommissionEdit = {
            id: '',
            amountIncludingVAT: 0,
            vat: 0,
            commissionTypeId: '',
            policyId: '',
            date: ''
        };
        this.props.dispatch(receiveCommission(commission));
    };

    getColumns = () => {
        return [
            getColumn('date', 'Date', { type: 'date' }),
            getColumn('commissionTypeId', 'Type', {
                render: (commissionTypeId: string) => {
                    return (
                        <CommissionTypeName
                            commissionTypeId={commissionTypeId}
                        />
                    );
                }
            }),
            getColumn('amountIncludingVAT', 'Amount (incl VAT)', {
                type: 'currency'
            }),
            getColumn('vat', 'VAT', { type: 'currency' }),
            getColumn('userId', 'Broker', {
                render: (userId: string) => {
                    return <UserName userId={userId} />;
                }
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
                    className="mb-1"
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="sync"
                                onClick={this.loadCommissions}
                                disabled={this.props.fetching}
                            >
                                Reload
                            </Button>
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
                <Row type="flex" justify="space-around" className="mb-1">
                    <Col>
                        <Statistic title="Total Amount" prefix="R" value={this.props.sumAmountIncludingVAT} />
                    </Col>
                    <Col>
                        <Statistic title="Average Amount" prefix="R" value={this.props.averageAmountIncludingVAT} />
                    </Col>
                    <Col>
                        <Statistic title="Total VAT" prefix="R" value={this.props.sumVAT} />
                    </Col>
                    <Col>
                        <Statistic title="Average VAR" prefix="R" value={this.props.averageVAT} />
                    </Col>
                </Row>
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
        filters: commissionsState.filters
    };
};

export default connect(mapStateToProps)(CommissionList);
