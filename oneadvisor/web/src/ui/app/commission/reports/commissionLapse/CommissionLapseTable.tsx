import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import {
    CommissionLapseData, commissionLapseSelector, receiveCommissionLapseFilters, receiveCommissionLapsePageOptions,
    receiveCommissionLapseSortOptions
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { getTable } from "@/ui/controls";

const Table = getTable<CommissionLapseData>();

type Props = {
    records: CommissionLapseData[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
} & DispatchProp;

class CommissionLapseTable extends Component<Props> {
    getColumns = () => {
        var getColumn = getColumnDefinition<CommissionLapseData>(true, this.props.filters);

        const columns = [
            getColumn("policyId", "Id"),
            getColumn(
                "clientLastName",
                "Last Name"
            ),
            getColumn("clientInitials", "Initials")
        ];

        return columns;
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receiveCommissionLapsePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveCommissionLapseSortOptions(sortOptions));
        if (this.props.filters != filters)
            this.props.dispatch(
                receiveCommissionLapseFilters({
                    ...this.props.filters,
                    ...filters,
                })
            );
    };

    render() {
        return (
            <Table
                rowKey="policyId"
                columns={this.getColumns()}
                dataSource={this.props.records}
                loading={this.props.fetching}
                onRowClick={() => { }}
                externalDataSource={true}
                pageOptions={this.props.pageOptions}
                totalRows={this.props.totalItems}
                onTableChange={this.onTableChange}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionLapseState = commissionLapseSelector(state);

    return {
        records: commissionLapseState.items,
        totalItems: commissionLapseState.totalItems,
        fetching: commissionLapseState.fetching,
        pageOptions: commissionLapseState.pageOptions,
        sortOptions: commissionLapseState.sortOptions,
        filters: commissionLapseState.filters,
    };
};

export default connect(mapStateToProps)(CommissionLapseTable);
