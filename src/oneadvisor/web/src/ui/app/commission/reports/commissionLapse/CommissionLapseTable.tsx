import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import {
    Filters,
    getBooleanOptions,
    getColumnDefinition,
    PageOptions,
    SortOptions,
} from "@/app/table";
import { RootState } from "@/state";
import {
    CommissionLapseData,
    commissionLapseSelector,
    receiveCommissionLapseFilters,
    receiveCommissionLapsePageOptions,
    receiveCommissionLapseSortOptions,
} from "@/state/commission/reports";
import { policyTypesSelector } from "@/state/lookups/client";
import { PolicyType } from "@/state/lookups/client/policyTypes/types";
import { Company, organisationCompaniesSelector } from "@/state/lookups/directory";
import { brokersSelector, UserSimple } from "@/state/lookups/directory/usersSimple";
import {
    CompanyName,
    getColumnSearchProps,
    getTable,
    PolicyTypeName,
    UserName,
} from "@/ui/controls";

const Table = getTable<CommissionLapseData>();

type Props = {
    records: CommissionLapseData[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    companies: Company[];
    policyTypes: PolicyType[];
    users: UserSimple[];
} & DispatchProp;

class CommissionLapseTable extends Component<Props> {
    getColumns = () => {
        const getColumn = getColumnDefinition<CommissionLapseData>(
            true,
            this.props.filters,
            this.props.sortOptions
        );

        const columns = [
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: this.props.companies.map((type) => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("number", "Number", {}, getColumnSearchProps("Number")),
            getColumn(
                "policyTypeId",
                "Type",
                {},
                {
                    render: (policyTypeId: string) => {
                        return <PolicyTypeName policyTypeId={policyTypeId} />;
                    },
                    filters: this.props.policyTypes.map((type) => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("clientLastName", "Last Name", {}, getColumnSearchProps("Last Name")),
            getColumn("clientInitials", "Initials"),
            getColumn(
                "userId",
                "Broker",
                {},
                {
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                    filters: this.props.users.map((user) => ({
                        text: user.fullName,
                        value: user.id,
                    })),
                }
            ),
            getColumn(
                "isActive",
                "Active",
                {
                    type: "boolean",
                },
                {
                    filters: getBooleanOptions(),
                }
            ),
        ];

        return columns;
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receiveCommissionLapsePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveCommissionLapseSortOptions(sortOptions));
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
    const companiesState = organisationCompaniesSelector(state);
    const policyTypesState = policyTypesSelector(state);

    return {
        records: commissionLapseState.items,
        totalItems: commissionLapseState.totalItems,
        fetching: commissionLapseState.fetching,
        pageOptions: commissionLapseState.pageOptions,
        sortOptions: commissionLapseState.sortOptions,
        filters: commissionLapseState.filters,
        companies: companiesState,
        policyTypes: policyTypesState.items,
        users: brokersSelector(state),
    };
};

export default connect(mapStateToProps)(CommissionLapseTable);
