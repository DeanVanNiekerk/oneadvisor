import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { Filters, getBooleanOptions, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import {
    CommissionLapseData, commissionLapseSelector, receiveCommissionLapseFilters, receiveCommissionLapsePageOptions,
    receiveCommissionLapseSortOptions
} from "@/state/app/commission/reports";
import { Company, organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { brokersSelector, UserSimple } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { CompanyName, getTable, PolicyTypeName, UserName } from "@/ui/controls";

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
        var getColumn = getColumnDefinition<CommissionLapseData>(true, this.props.filters, this.props.sortOptions);

        const columns = [
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: this.props.companies.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("number", "Number", { showSearchFilter: true }),
            getColumn(
                "policyTypeId",
                "Type",
                {},
                {
                    render: (policyTypeId: string) => {
                        return <PolicyTypeName policyTypeId={policyTypeId} />;
                    },
                    filters: this.props.policyTypes.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("clientLastName", "Last Name", {
                showSearchFilter: true,
            }),
            getColumn("clientInitials", "Initials"),
            getColumn(
                "userId",
                "Broker",
                {},
                {
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                    filters: this.props.users.map(user => ({
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
                onRowClick={() => {}}
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
