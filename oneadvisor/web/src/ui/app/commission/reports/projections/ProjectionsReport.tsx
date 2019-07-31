import { Col, Divider, Row, Select } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { filterOption } from "@/app/controls/select";
import { DATE_FORMAT } from "@/app/utils";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import {
    commissionProjectionsSelector, fetchPastRevenueCommissionData, pastMonthsCountSelector,
    PastRevenueCommissionDataFilters, receivePastRevenueCommissionFilters
} from "@/state/app/commission/reports";
import { branchesSimpleSelector, BranchSimple } from "@/state/app/directory/branchesSimple";
import { UserSimple, usersSimpleSelector } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Button, Header } from "@/ui/controls";

import GroupsTable from "./GroupsTable";
import TotalsTable from "./TotalsTable";

type Props = {
    filters: PastRevenueCommissionDataFilters;
    branches: BranchSimple[];
    users: UserSimple[];
    policyTypes: PolicyType[];
    pastMonthsCount: number;
} & DispatchProp;

class ProjectionsReport extends Component<Props> {
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.props.dispatch(fetchPastRevenueCommissionData(this.props.filters));
    };

    selectedBranchIds = (): string[] => {
        return this.props.filters.branchId || [];
    };

    handleBranchChange = (branchIds: string[]) => {
        this.props.dispatch(
            receivePastRevenueCommissionFilters({
                ...this.props.filters,
                branchId: branchIds,
                userId: [], //Clear user when branch changes
            })
        );
    };

    selectedUserIds = (): string[] => {
        return this.props.filters.userId || [];
    };

    handleUserChange = (userIds: string[]) => {
        this.props.dispatch(
            receivePastRevenueCommissionFilters({
                ...this.props.filters,
                userId: userIds,
            })
        );
    };

    selectedPolicyTypeIds = (): string[] => {
        return this.props.filters.policyTypeId || [];
    };

    handlePolicyTypeChange = (policyTypeIds: string[]) => {
        this.props.dispatch(
            receivePastRevenueCommissionFilters({
                ...this.props.filters,
                policyTypeId: policyTypeIds,
            })
        );
    };

    selectedPastMonthsCount = (): string => {
        return this.props.pastMonthsCount.toString();
    };

    handlePastMonthsCountChange = (pastMonthsCount: string) => {
        this.props.dispatch(
            receivePastRevenueCommissionFilters({
                ...this.props.filters,
                startDate: [
                    moment()
                        .subtract(parseInt(pastMonthsCount), "months")
                        .startOf("month")
                        .format(DATE_FORMAT),
                ],
            })
        );
    };

    render() {
        return (
            <>
                <Header icon="history">Projections Report</Header>

                <Row type="flex" gutter={10} align="middle" justify="start" className="mb-1">
                    <Col>Past</Col>
                    <Col>
                        <Select
                            value={this.selectedPastMonthsCount()}
                            onChange={this.handlePastMonthsCountChange}
                            allowClear={false}
                            style={{ width: 120 }}
                        >
                            <Select.Option key="3" value="3">
                                3 Months
                            </Select.Option>
                            <Select.Option key="6" value="6">
                                6 Months
                            </Select.Option>
                            <Select.Option key="12" value="12">
                                12 Months
                            </Select.Option>
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={9}
                            value={this.selectedBranchIds()}
                            onChange={this.handleBranchChange}
                            placeholder="Branch"
                            allowClear={true}
                            filterOption={filterOption}
                            style={{ width: 220 }}
                        >
                            {this.props.branches.map(branch => {
                                return (
                                    <Select.Option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={9}
                            value={this.selectedUserIds()}
                            onChange={this.handleUserChange}
                            placeholder="Broker"
                            allowClear={true}
                            filterOption={filterOption}
                            style={{ width: 220 }}
                        >
                            {this.props.users
                                .filter(
                                    u =>
                                        this.selectedBranchIds().length === 0 ||
                                        this.selectedBranchIds().some(id => id === u.branchId)
                                )
                                .map(user => {
                                    return (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={9}
                            value={this.selectedPolicyTypeIds()}
                            onChange={this.handlePolicyTypeChange}
                            placeholder="Policy Type"
                            allowClear={true}
                            filterOption={filterOption}
                            style={{ width: 220 }}
                        >
                            {this.props.policyTypes.map(policyType => {
                                return (
                                    <Select.Option key={policyType.id} value={policyType.id}>
                                        {policyType.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Button onClick={this.loadData} icon="reload">
                            Reload
                        </Button>
                    </Col>
                </Row>

                <TotalsTable />

                <div className="mb-1" />

                <GroupsTable />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const branchesState = branchesSimpleSelector(state);
    const usersState = usersSimpleSelector(state);
    const policyTypesState = policyTypesSelector(state);
    const projectionsState = commissionProjectionsSelector(state);

    return {
        filters: projectionsState.filters,
        branches: branchesState.items,
        users: usersState.items,
        policyTypes: policyTypesState.items,
        pastMonthsCount: pastMonthsCountSelector(state),
    };
};

export default connect(mapStateToProps)(ProjectionsReport);
