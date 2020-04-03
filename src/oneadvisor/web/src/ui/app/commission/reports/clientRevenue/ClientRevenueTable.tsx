import { Badge } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { useCaseSelector } from "@/state/auth";
import {
    ClientRevenueData,
    clientRevenueSelector,
    receiveClientRevenueFilters,
    receiveClientRevenuePageOptions,
    receiveClientRevenueSortOptions,
} from "@/state/commission/reports";
import { RootState } from "@/state/rootReducer";
import { Age, getColumnSearchProps, getTable } from "@/ui/controls";
import { ShareAltOutlined } from "@ant-design/icons";

const Table = getTable<ClientRevenueData>();

type Props = {
    records: ClientRevenueData[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    useCases: string[];
    editAllocations: (clientId: string | null) => void;
} & DispatchProp;

class ClientRevenueTable extends Component<Props> {
    getColumns = () => {
        const getColumn = getColumnDefinition<ClientRevenueData>(
            true,
            this.props.filters,
            this.props.sortOptions
        );

        const columns = [
            getColumn(
                "clientLastName",
                "Last Name",
                {},
                {
                    width: 220,
                    fixed: "left",
                    ...getColumnSearchProps("Last Name"),
                }
            ),
            getColumn("clientInitials", "Initials", {}),
            getColumn(
                "clientDateOfBirth",
                "Age",
                {},
                {
                    render: (clientDateOfBirth: string) => {
                        return <Age dateOfBirth={clientDateOfBirth} />;
                    },
                }
            ),
            getColumn("monthlyAnnuityMonth", "Monthly As & When Commission", {
                type: "currency",
            }),
            getColumn("annualAnnuityAverage", "Annual Commissions Avg Monthly", {
                type: "currency",
            }),
            getColumn("totalMonthlyEarnings", "Total Monthly Earnings", {
                type: "currency",
            }),
            getColumn("lifeFirstYears", "Life Upfronts", {
                type: "currency",
            }),
            getColumn("onceOff", "Once Off Commissions", {
                type: "currency",
            }),
            getColumn("grandTotal", "Grand Total Last 12 Months", {
                type: "currency",
            }),
        ];

        if (hasUseCase("com_view_commission_allocations", this.props.useCases)) {
            columns.push(
                getColumn(
                    "rowNumber",
                    "",
                    {},
                    {
                        fixed: "right",
                        width: 40,
                        render: (value: string, record: ClientRevenueData) => {
                            return (
                                <Badge dot count={record.allocationsCount}>
                                    <ShareAltOutlined
                                        onClick={() => this.props.editAllocations(record.clientId)}
                                    />
                                </Badge>
                            );
                        },
                    }
                )
            );
        }

        return columns;
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receiveClientRevenuePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveClientRevenueSortOptions(sortOptions));
        if (this.props.filters != filters)
            this.props.dispatch(
                receiveClientRevenueFilters({
                    ...this.props.filters,
                    ...filters,
                })
            );
    };

    render() {
        return (
            <Table
                rowKey="rowNumber"
                columns={this.getColumns()}
                dataSource={this.props.records}
                loading={this.props.fetching}
                externalDataSource={true}
                pageOptions={this.props.pageOptions}
                totalRows={this.props.totalItems}
                onTableChange={this.onTableChange}
                scroll={{
                    x: 1300,
                }}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientRevenueState = clientRevenueSelector(state);

    return {
        records: clientRevenueState.itemsPaged,
        totalItems: clientRevenueState.totalItems,
        fetching: clientRevenueState.fetchingPaged,
        pageOptions: clientRevenueState.pageOptions,
        sortOptions: clientRevenueState.sortOptions,
        filters: clientRevenueState.filters,
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(ClientRevenueTable);
