import { Col, Row, Select, Slider } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { filterOption } from "@/app/controls/select";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import {
    CommissionEarningsType,
    commissionEarningsTypesSelector,
} from "@/state/app/commission/lookups";
import {
    commissionProjectionsSelector,
    fetchPastRevenueCommissionData,
    Group,
    PastRevenueCommissionDataFilters,
    receivePastRevenueCommissionFilters,
    receivePastRevenueCommissionGroups,
    receivePastRevenueCommissionMonthsBack,
    receivePastRevenueCommissionMonthsForward,
} from "@/state/app/commission/reports";
import { branchesSimpleSelector, BranchSimple } from "@/state/app/directory/branchesSimple";
import { Company, organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { brokersSelector, UserSimple } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Header, TabPane, Tabs } from "@/ui/controls";
import { BarChartOutlined, TableOutlined } from "@ant-design/icons";

import GroupsTable from "./GroupsTable";
import TotalsBarChart from "./TotalsBarChart";

type TabKey = "table" | "chart";

type Props = {
    filters: PastRevenueCommissionDataFilters;
    branches: BranchSimple[];
    users: UserSimple[];
    policyTypes: PolicyType[];
    commissionEarningsTypes: CommissionEarningsType[];
    companies: Company[];
    monthsBack: number;
    monthsForward: number;
    groups: Group[];
} & DispatchProp;

type State = {
    activeTab: TabKey;
};

class ProjectionsReport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: "table",
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.filters != this.props.filters) this.loadData();
    }

    loadData = () => {
        this.props.dispatch(fetchPastRevenueCommissionData(this.props.filters));
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
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

    selectedCommissionEarningsTypeIds = (): string[] => {
        return this.props.filters.commissionEarningsTypeId || [];
    };

    handleCommissionEarningsTypeChange = (commissionEarningsTypeIds: string[]) => {
        this.props.dispatch(
            receivePastRevenueCommissionFilters({
                ...this.props.filters,
                commissionEarningsTypeId: commissionEarningsTypeIds,
            })
        );
    };

    selectedCompanyIds = (): string[] => {
        return this.props.filters.companyId || [];
    };

    handleCompanyChange = (companyIds: string[]) => {
        this.props.dispatch(
            receivePastRevenueCommissionFilters({
                ...this.props.filters,
                companyId: companyIds,
            })
        );
    };

    handlePastMonthsCountChange = (monthsBack: number) => {
        this.props.dispatch(receivePastRevenueCommissionMonthsBack(monthsBack));
    };

    handleFutureMonthsCountChange = (monthsForward: number) => {
        this.props.dispatch(receivePastRevenueCommissionMonthsForward(monthsForward));
    };

    handleGroupsChange = (groups: Group[]) => {
        this.props.dispatch(receivePastRevenueCommissionGroups(groups));
    };

    render() {
        const cellClass = "pb-05";
        const allGroups: Group[] = ["Policy Type", "Earnings Type", "Company"];

        return (
            <>
                <Header iconName="history">Projections Report</Header>

                <Row gutter={10} align="middle" justify="start">
                    <Col className={cellClass}>Months Back</Col>
                    <Col className={cellClass}>
                        <Slider
                            defaultValue={this.props.monthsBack}
                            min={1}
                            max={12}
                            step={1}
                            style={{ width: "150px" }}
                            onAfterChange={this.handlePastMonthsCountChange}
                        />
                    </Col>
                    <Col className={cellClass}>Months Ahead</Col>
                    <Col className={cellClass}>
                        <Slider
                            defaultValue={this.props.monthsForward}
                            min={1}
                            max={12}
                            step={1}
                            style={{ width: "150px" }}
                            onAfterChange={this.handleFutureMonthsCountChange}
                        />
                    </Col>
                    {/* <Col className={cellClass}>Past</Col>
                    <Col className={cellClass}>
                        <Select
                            value={this.props.monthsBack}
                            onChange={this.handlePastMonthsCountChange}
                            allowClear={false}
                            style={{ width: 120 }}
                        >
                            <Select.Option key="3" value={3}>
                                3 Months
                            </Select.Option>
                            <Select.Option key="6" value={6}>
                                6 Months
                            </Select.Option>
                            <Select.Option key="12" value={12}>
                                12 Months
                            </Select.Option>
                        </Select>
                    </Col>
                    <Col className={cellClass}>Future</Col>
                    <Col className={cellClass}>
                        <Select
                            value={this.props.monthsForward}
                            onChange={this.handleFutureMonthsCountChange}
                            allowClear={false}
                            style={{ width: 120 }}
                        >
                            <Select.Option key="3" value={3}>
                                3 Months
                            </Select.Option>
                            <Select.Option key="6" value={6}>
                                6 Months
                            </Select.Option>
                            <Select.Option key="12" value={12}>
                                12 Months
                            </Select.Option>
                        </Select>
                    </Col> */}
                    <Col className={cellClass}>Group By</Col>
                    <Col className={cellClass}>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={9}
                            value={this.props.groups}
                            onChange={this.handleGroupsChange}
                            allowClear={true}
                            style={{ width: 220 }}
                        >
                            {allGroups.map((group) => {
                                return (
                                    <Select.Option key={group} value={group}>
                                        {group}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col className={cellClass}>
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
                            {this.props.branches.map((branch) => {
                                return (
                                    <Select.Option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col className={cellClass}>
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
                                    (u) =>
                                        this.selectedBranchIds().length === 0 ||
                                        this.selectedBranchIds().some((id) => id === u.branchId)
                                )
                                .map((user) => {
                                    return (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Col>
                    <Col className={cellClass}>
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
                            {this.props.policyTypes.map((policyType) => {
                                return (
                                    <Select.Option key={policyType.id} value={policyType.id}>
                                        {policyType.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col className={cellClass}>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={9}
                            value={this.selectedCommissionEarningsTypeIds()}
                            onChange={this.handleCommissionEarningsTypeChange}
                            placeholder="Earnings Type"
                            allowClear={true}
                            filterOption={filterOption}
                            style={{ width: 220 }}
                        >
                            {this.props.commissionEarningsTypes.map((commissionEarningsType) => {
                                return (
                                    <Select.Option
                                        key={commissionEarningsType.id}
                                        value={commissionEarningsType.id}
                                    >
                                        {commissionEarningsType.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col className={cellClass}>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={9}
                            value={this.selectedCompanyIds()}
                            onChange={this.handleCompanyChange}
                            placeholder="Company"
                            allowClear={true}
                            filterOption={filterOption}
                            style={{ width: 220 }}
                        >
                            {this.props.companies.map((company) => {
                                return (
                                    <Select.Option key={company.id} value={company.id}>
                                        {company.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                </Row>

                <Tabs
                    onChange={this.onTabChange}
                    activeKey={this.state.activeTab}
                    sticky={true}
                    tabBarGutter={0}
                >
                    <TabPane tab={<TableOutlined className="mr-0" />} key="table">
                        <GroupsTable
                            monthsBack={this.props.monthsBack}
                            monthsForward={this.props.monthsForward}
                        />
                    </TabPane>
                    <TabPane
                        tab={<BarChartOutlined className="mr-0" />}
                        key="chart"
                        className="pt-0"
                    >
                        <TotalsBarChart />
                    </TabPane>
                </Tabs>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const branchesState = branchesSimpleSelector(state);
    const policyTypesState = policyTypesSelector(state);
    const commissionEarningsTypesState = commissionEarningsTypesSelector(state);
    const companiesState = organisationCompaniesSelector(state);
    const projectionsState = commissionProjectionsSelector(state);

    return {
        filters: projectionsState.filters,
        branches: branchesState.items,
        users: brokersSelector(state),
        policyTypes: policyTypesState.items,
        monthsBack: projectionsState.monthsBack,
        monthsForward: projectionsState.monthsForward,
        commissionEarningsTypes: commissionEarningsTypesState.items,
        companies: companiesState,
        groups: projectionsState.groups,
    };
};

export default connect(mapStateToProps)(ProjectionsReport);
