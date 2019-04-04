import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import { PolicyType, policyTypesSelector } from '@/state/app/client/lookups';
import {
    fetchPolicies, fetchPolicy, newPolicy, policiesSelector, Policy, receiveFilters, receivePageOptions, receivePolicy,
    receiveSortOptions
} from '@/state/app/client/policies';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Button, CompanyName, Header, PolicyTypeName, Table, UserName } from '@/ui/controls';

import EditPolicy from './EditPolicy';

type Props = {
    clientId?: string;
    policies: Policy[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    onChange?: () => void;
    companies: Company[];
    policyTypes: PolicyType[];
    users: UserSimple[];
} & DispatchProp;

class PolicyList extends Component<Props> {
    componentDidMount() {
        this.loadPolicies();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadPolicies();
    }

    loadPolicies = () => {
        const filters = {
            ...this.props.filters,
            clientId: [] as string[],
        };

        if (this.props.clientId) filters.clientId.push(this.props.clientId);

        this.props.dispatch(
            fetchPolicies(
                this.props.pageOptions,
                this.props.sortOptions,
                this.updateFilters(filters)
            )
        );
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["number", "clientLastName"]);
    };

    editPolicy = (id: string) => {
        this.props.dispatch(fetchPolicy(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) {
            this.loadPolicies();
            if (this.props.onChange) this.props.onChange();
        }
    };

    newPolicy = () => {
        const policy = newPolicy({
            clientId: this.props.clientId,
        });
        this.props.dispatch(receivePolicy(policy));
    };

    getColumns = () => {
        const columns = [
            getColumnEDS(
                "companyId",
                "Company",
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: this.props.companies.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                },
                this.props.filters
            ),
            getColumnEDS(
                "number",
                "Number",
                { showSearchFilter: true },
                this.props.filters
            ),
            getColumnEDS(
                "policyTypeId",
                "Type",
                {
                    render: (policyTypeId: string) => {
                        return <PolicyTypeName policyTypeId={policyTypeId} />;
                    },
                    filters: this.props.policyTypes.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                },
                this.props.filters
            ),
            getColumnEDS(
                "userId",
                "Broker",
                {
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                    filters: this.props.users.map(user => ({
                        text: user.fullName,
                        value: user.id,
                    })),
                },
                this.props.filters
            ),
        ];

        if (!this.props.clientId) {
            columns.splice(
                3,
                0,
                getColumnEDS(
                    "clientLastName",
                    "Last Name",
                    {
                        showSearchFilter: true,
                    },
                    this.props.filters
                ),
                getColumnEDS("clientInitials", "Initials"),
                getColumnEDS("clientDateOfBirth", "Date of Birth", {
                    type: "date",
                })
            );
        }

        return columns;
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
                                onClick={this.loadPolicies}
                                disabled={this.props.fetching}
                            >
                                Reload
                            </Button>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newPolicy}
                                disabled={this.props.fetching}
                                requiredUseCase="clt_edit_policies"
                                visible={!!this.props.clientId}
                            >
                                New Policy
                            </Button>
                        </>
                    }
                    icon={!this.props.clientId ? "file-text" : ""}
                >
                    {!this.props.clientId && <span>Policies</span>}
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.policies}
                    loading={this.props.fetching}
                    onRowClick={policy => this.editPolicy(policy.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
                <EditPolicy onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policiesState = policiesSelector(state);
    const companiesState = companiesSelector(state);
    const policyTypesState = policyTypesSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        policies: policiesState.items,
        fetching: policiesState.fetching,
        pageOptions: policiesState.pageOptions,
        sortOptions: policiesState.sortOptions,
        totalItems: policiesState.totalItems,
        filters: policiesState.filters,
        companies: companiesState.items,
        policyTypes: policyTypesState.items,
        users: usersState.items,
    };
};

export default connect(mapStateToProps)(PolicyList);
