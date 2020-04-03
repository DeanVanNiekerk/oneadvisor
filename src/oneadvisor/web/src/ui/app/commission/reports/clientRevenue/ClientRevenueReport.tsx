import { Col, Row, Select } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { filterOption } from "@/app/controls/select";
import { downloadExcel } from "@/app/excel/helpers";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { DATE_FORMAT, getMonthName, getMonthOptions, getYearOptions } from "@/app/utils";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import {
    clientRevenueSelector,
    fetchClientRevenueDataPaged,
    getClientRevenueData,
    receiveClientRevenueFilters,
} from "@/state/app/commission/reports";
import { branchesSimpleSelector, BranchSimple } from "@/state/directory/branchesSimple";
import { brokersSelector, UserSimple } from "@/state/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Button, ClientName, Drawer, Header, TabPane, Tabs } from "@/ui/controls";
import { BarChartOutlined, TableOutlined } from "@ant-design/icons";

import AllocationList from "../../allocation/AllocationList";
import ClientRevenueChart from "./ClientRevenueChart";
import ClientRevenueTable from "./ClientRevenueTable";

type TabKey = "table" | "chart";

type Props = {
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    filters: Filters;
    branches: BranchSimple[];
    users: UserSimple[];
    policyTypes: PolicyType[];
} & DispatchProp;

type State = {
    editAllocationsClientId: string | null;
    downloading: boolean;
    activeTab: TabKey;
};

class ClientRevenueReport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            editAllocationsClientId: null,
            downloading: false,
            activeTab: "table",
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadData();
    }

    loadData = () => {
        this.props.dispatch(
            fetchClientRevenueDataPaged(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    editAllocations = (clientId: string | null) => {
        this.setState({
            editAllocationsClientId: clientId,
        });
    };

    closeEditAllocations = () => {
        this.setState({
            editAllocationsClientId: null,
        });
        this.loadData();
    };

    handleYearChange = (year: number) => {
        this.props.dispatch(
            receiveClientRevenueFilters({
                ...this.props.filters,
                yearEnding: [year.toString()],
            })
        );
    };

    selectedYear = (): number => {
        const yearEnding = this.props.filters.yearEnding;
        return parseInt(yearEnding ? yearEnding[0] : "");
    };

    handleMonthChange = (month: number) => {
        this.props.dispatch(
            receiveClientRevenueFilters({
                ...this.props.filters,
                monthEnding: [month.toString()],
            })
        );
    };

    selectedMonth = (): number => {
        const monthEnding = this.props.filters.monthEnding;
        return parseInt(monthEnding ? monthEnding[0] : "");
    };

    selectedBranchIds = (): string[] => {
        return this.props.filters.branchId || [];
    };

    handleBranchChange = (branchIds: string[]) => {
        this.props.dispatch(
            receiveClientRevenueFilters({
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
            receiveClientRevenueFilters({
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
            receiveClientRevenueFilters({
                ...this.props.filters,
                policyTypeId: policyTypeIds,
            })
        );
    };

    download = () => {
        this.setState({ downloading: true });
        this.props.dispatch(
            getClientRevenueData(this.props.filters, (records) => {
                this.setState({ downloading: false });
                downloadExcel(
                    records.items.map((d) => {
                        delete d.rowNumber;
                        delete d.clientId;
                        d.clientDateOfBirth = d.clientDateOfBirth
                            ? moment(d.clientDateOfBirth).format(DATE_FORMAT)
                            : d.clientDateOfBirth;
                        return d;
                    }),
                    `ClientRevenue_${getMonthName(
                        this.selectedMonth()
                    )}_${this.selectedYear()}.xlsx`
                );
            })
        );
    };

    render() {
        return (
            <>
                <Header
                    iconName="line-chart"
                    actions={
                        <Row gutter={10} align="middle">
                            <Col>
                                <Button
                                    iconName="download"
                                    onClick={this.download}
                                    loading={this.state.downloading}
                                    noLeftMargin={true}
                                >
                                    Download
                                </Button>
                            </Col>
                        </Row>
                    }
                >
                    Client Revenue Report
                </Header>

                <Row gutter={10} align="middle" justify="start">
                    <Col>Month Ending:</Col>
                    <Col>
                        <Select
                            value={this.selectedMonth()}
                            onChange={this.handleMonthChange}
                            style={{ width: 125 }}
                        >
                            {getMonthOptions().map((month) => {
                                return (
                                    <Select.Option
                                        key={month.number.toString()}
                                        value={month.number}
                                    >
                                        {month.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            value={this.selectedYear()}
                            onChange={this.handleYearChange}
                            style={{ width: 90 }}
                        >
                            {getYearOptions().map((year) => {
                                return (
                                    <Select.Option key={year.toString()} value={year}>
                                        {year}
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
                            {this.props.policyTypes.map((policyType) => {
                                return (
                                    <Select.Option key={policyType.id} value={policyType.id}>
                                        {policyType.name}
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
                    <TabPane tab={<TableOutlined className="mx-1" />} key="table">
                        <ClientRevenueTable editAllocations={this.editAllocations} />
                    </TabPane>
                    <TabPane
                        tab={<BarChartOutlined className="mx-1" />}
                        key="chart"
                        className="pt-0"
                    >
                        <ClientRevenueChart />
                    </TabPane>
                </Tabs>

                <Drawer
                    title={
                        <ClientName
                            prefix="Allocations to "
                            clientId={this.state.editAllocationsClientId}
                        />
                    }
                    iconName="share-alt"
                    noTopPadding={true}
                    visible={!!this.state.editAllocationsClientId}
                    onClose={this.closeEditAllocations}
                    footer={<Button onClick={this.closeEditAllocations}>Close</Button>}
                >
                    {this.state.editAllocationsClientId && (
                        <AllocationList clientId={this.state.editAllocationsClientId} />
                    )}
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientRevenueState = clientRevenueSelector(state);
    const branchesState = branchesSimpleSelector(state);
    const policyTypesState = policyTypesSelector(state);

    return {
        pageOptions: clientRevenueState.pageOptions,
        sortOptions: clientRevenueState.sortOptions,
        filters: clientRevenueState.filters,
        branches: branchesState.items,
        users: brokersSelector(state),
        policyTypes: policyTypesState.items,
    };
};

export default connect(mapStateToProps)(ClientRevenueReport);
