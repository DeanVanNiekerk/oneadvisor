import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import { formatCurrency } from '@/app/utils';
import {
    fetchMemberRevenueData, MemberRevenueData, memberRevenueSelector, receiveFilters, receivePageOptions,
    receiveSortOptions
} from '@/state/app/commission/reports';
import { RootState } from '@/state/rootReducer';
import { Header, Table } from '@/ui/controls';

type Props = {
    records: MemberRevenueData[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
} & DispatchProp;

class MemberRevenueReport extends Component<Props> {
    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadData();
    }

    loadData = () => {
        this.props.dispatch(
            fetchMemberRevenueData(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    getColumns = () => {
        return [
            getColumnEDS("memberFirstName", "First Name"),
            getColumnEDS("memberLastName", "Last Name"),
            getColumnEDS("annualAnnuity", "Annual Annuity", {
                type: "currency",
            }),
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
                <Header icon="line-chart">Member Revenue Report</Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.records}
                    loading={this.props.fetching}
                    onRowClick={() => {}}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const memberRevenueState = memberRevenueSelector(state);

    return {
        records: memberRevenueState.items,
        totalItems: memberRevenueState.totalItems,
        fetching: memberRevenueState.fetching,
        pageOptions: memberRevenueState.pageOptions,
        sortOptions: memberRevenueState.sortOptions,
        filters: memberRevenueState.filters,
    };
};

export default connect(mapStateToProps)(MemberRevenueReport);
