import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { Filters, formatBool, getColumnDefinition, PageOptions, SortOptions } from '@/app/table';
import {
    fetchSplitRulePolicies, receiveFilters, receivePageOptions, receiveSortOptions, splitRulePoliciesSelector,
    SplitRulePolicyInfo
} from '@/state/app/commission/splitRulePolicies';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Button, CompanyName, getTable, Header, UserName } from '@/ui/controls';

//import EditCommission from './EditCommission';

type Props = {
    splitRulePolicies: SplitRulePolicyInfo[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    filters: Filters;
    totalItems: number;
    users: UserSimple[];
    //onCommissionsUpdate?: () => void;
    companies: Company[];
} & DispatchProp;

class SplitRulePolicyList extends Component<Props> {
    componentDidMount() {
        this.loadSplitRulePolicies();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadSplitRulePolicies();
    }

    loadSplitRulePolicies = () => {
        this.props.dispatch(
            fetchSplitRulePolicies(
                this.props.pageOptions,
                this.props.sortOptions,
                this.updateFilters(this.props.filters)
            )
        );
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["policyNumber"]);
    };

    // editCommission = (id: string) => {
    //     this.props.dispatch(fetchCommission(id));
    // };

    // onFormClose = (cancelled: boolean) => {
    //     if (!cancelled) {
    //         this.loadCommissions();
    //         if (this.props.onCommissionsUpdate) this.props.onCommissionsUpdate();
    //     }
    // };

    // newCommission = () => {
    //     const commission: CommissionEdit = {
    //         id: "",
    //         commissionStatementId: this.props.commissionStatementId || "",
    //         amountIncludingVAT: 0,
    //         vat: 0,
    //         commissionTypeId: "",
    //         policyId: "",
    //         userId: "",
    //         splitGroupId: null,
    //         sourceData: null,
    //     };
    //     this.props.dispatch(receiveCommission(commission));
    // };

    getColumns = () => {
        var getColumn = getColumnDefinition<SplitRulePolicyInfo>(true, this.props.filters);

        return [
            getColumn(
                "policyUserId",
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
                "policyCompanyId",
                "Company",
                {},
                {
                    render: (policyCompanyId: string) => {
                        return <CompanyName companyId={policyCompanyId} />;
                    },
                    filters: this.props.companies.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("policyNumber", "Policy Number", {
                showSearchFilter: true,
            }),
        ];
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters) this.props.dispatch(receiveFilters(filters));
    };

    render() {
        const Table = getTable<SplitRulePolicyInfo>();

        return (
            <>
                <Header className="mb-1" icon="apartment">
                    Commission Split Rules
                </Header>
                <Table
                    rowKey="policyNumber"
                    columns={this.getColumns()}
                    dataSource={this.props.splitRulePolicies}
                    loading={this.props.fetching}
                    //onRowClick={commission => this.editCommission(commission.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    scroll={{
                        x: true,
                    }}
                />
                {/* <EditCommission onClose={this.onFormClose} /> */}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const splitRulePoliciesState = splitRulePoliciesSelector(state);
    const usersState = usersSimpleSelector(state);
    const companiesState = companiesSelector(state);

    return {
        splitRulePolicies: splitRulePoliciesState.items,
        fetching: splitRulePoliciesState.fetching,
        pageOptions: splitRulePoliciesState.pageOptions,
        sortOptions: splitRulePoliciesState.sortOptions,
        totalItems: splitRulePoliciesState.totalItems,
        filters: splitRulePoliciesState.filters,
        users: usersState.items,
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(SplitRulePolicyList);
