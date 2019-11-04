import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { applyLike } from "@/app/query";
import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import {
    fetchSplitRulePolicies,
    fetchSplitRulePolicy,
    receiveFilters,
    receivePageOptions,
    receiveSortOptions,
    splitRulePoliciesSelector,
    SplitRulePolicyInfo,
} from "@/state/app/commission/splitRulePolicies";
import { Company, organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { brokersSelector, UserSimple } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { CompanyName, getTable, Header, UserName } from "@/ui/controls";

import EditSplitRulePolicy from "./EditSplitRulePolicy";

const Table = getTable<SplitRulePolicyInfo>();

type Props = {
    splitRulePolicies: SplitRulePolicyInfo[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    filters: Filters;
    totalItems: number;
    users: UserSimple[];
    companies: Company[];
} & DispatchProp;

type State = {
    selectedSplitRulePolicy: SplitRulePolicyInfo | null;
};

class SplitRulePolicyList extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            selectedSplitRulePolicy: null,
        };
    }

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

    editSplitRulePolicy = (splitRulePolicyInfo: SplitRulePolicyInfo) => {
        this.setState({ selectedSplitRulePolicy: splitRulePolicyInfo });
        this.props.dispatch(fetchSplitRulePolicy(splitRulePolicyInfo.policyId));
    };

    onFormClose = (cancelled: boolean) => {
        this.setState({ selectedSplitRulePolicy: null });
        if (!cancelled) {
            this.loadSplitRulePolicies();
        }
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<SplitRulePolicyInfo>(true, this.props.filters, this.props.sortOptions);

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
            getColumn("policyClientFirstName", "Client First Name", {
                showSearchFilter: true,
            }),
            getColumn("policyClientLastName", "Client Last Name", {
                showSearchFilter: true,
            }),
            getColumn("policyNumber", "Policy Number", {
                showSearchFilter: true,
            }),
            getColumn(
                "commissionSplitRuleName",
                "Split",
                {},
                {
                    render: (commissionSplitRuleName: string, splitRuleInfo: SplitRulePolicyInfo) => {
                        if (splitRuleInfo.commissionSplitRuleId) return commissionSplitRuleName;

                        if (splitRuleInfo.defaultCommissionSplitRuleId)
                            return (
                                <>
                                    <span className="text-primary">Default Rule</span> (
                                    {splitRuleInfo.defaultCommissionSplitRuleName})
                                </>
                            );

                        return "";
                    },
                }
            ),
        ];
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters) this.props.dispatch(receiveFilters(filters));
    };

    render() {
        return (
            <>
                <Header className="mb-1" icon="apartment">
                    Policy Commission Split Rules
                </Header>
                <Table
                    rowKey="policyNumber"
                    columns={this.getColumns()}
                    dataSource={this.props.splitRulePolicies}
                    loading={this.props.fetching}
                    onRowClick={rule => this.editSplitRulePolicy(rule)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    scroll={{
                        x: true,
                    }}
                />
                <EditSplitRulePolicy
                    onClose={this.onFormClose}
                    splitRulePolicyInfo={this.state.selectedSplitRulePolicy}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const splitRulePoliciesState = splitRulePoliciesSelector(state);
    const companiesState = organisationCompaniesSelector(state);

    return {
        splitRulePolicies: splitRulePoliciesState.items,
        fetching: splitRulePoliciesState.fetching,
        pageOptions: splitRulePoliciesState.pageOptions,
        sortOptions: splitRulePoliciesState.sortOptions,
        totalItems: splitRulePoliciesState.totalItems,
        filters: splitRulePoliciesState.filters,
        users: brokersSelector(state),
        companies: companiesState,
    };
};

export default connect(mapStateToProps)(SplitRulePolicyList);
