import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import {
    fetchPolicies, fetchPolicy, newPolicy, policiesSelector, Policy, receiveFilters, receivePageOptions, receivePolicy,
    receiveSortOptions
} from '@/state/app/member/policies';
import { RootState } from '@/state/rootReducer';
import { Button, CompanyName, Header, PolicyTypeName, Table, UserName } from '@/ui/controls';

import EditPolicy from './EditPolicy';

type Props = {
    memberId: string;
    policies: Policy[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
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
        const filters = { ...this.props.filters };

        if (this.props.memberId) filters.memberId = [this.props.memberId];

        this.props.dispatch(
            fetchPolicies(
                this.props.pageOptions,
                this.props.sortOptions,
                filters
            )
        );
    };

    editPolicy = (id: string) => {
        this.props.dispatch(fetchPolicy(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadPolicies();
    };

    newPolicy = () => {
        const policy = newPolicy(this.props.memberId);
        this.props.dispatch(receivePolicy(policy));
    };

    getColumns = () => {
        return [
            getColumnEDS('policyTypeId', 'Type', {
                render: (policyTypeId: string) => {
                    return <PolicyTypeName policyTypeId={policyTypeId} />;
                }
            }),
            getColumnEDS('number', 'Number', { showSearchFilter: true }),
            getColumnEDS('premium', 'Premium', { type: 'currency' }),
            getColumnEDS('companyId', 'Company', {
                render: (companyId: string) => {
                    return <CompanyName companyId={companyId} />;
                }
            }),
            getColumnEDS('userId', 'Broker', {
                render: (userId: string) => {
                    return <UserName userId={userId} />;
                }
            })
        ];
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ['number']);
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
                                requiredUseCase="mem_edit_policies"
                            >
                                New Policy
                            </Button>
                        </>
                    }
                />
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

    return {
        policies: policiesState.items,
        fetching: policiesState.fetching,
        pageOptions: policiesState.pageOptions,
        sortOptions: policiesState.sortOptions,
        totalItems: policiesState.totalItems,
        filters: policiesState.filters
    };
};

export default connect(mapStateToProps)(PolicyList);
