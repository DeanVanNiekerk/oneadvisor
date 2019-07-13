import { Col, Icon, Row, Select } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { downloadExcel } from "@/app/excel/helpers";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { DATE_FORMAT, getMonthName, getMonthOptions, getYearOptions } from "@/app/utils";
import { PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import {
    clientRevenueSelector, fetchClientRevenueDataPaged, getClientRevenueData, receiveClientRevenueFilters
} from "@/state/app/commission/reports";
import { Branch, branchesSelector, fetchBranches } from "@/state/app/directory/branches";
import { UserSimple, usersSimpleSelector } from "@/state/app/directory/usersSimple";
import { userOrganisationIdSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, ClientName, Drawer, DrawerFooter, Header, TabPane, Tabs } from "@/ui/controls";

import AllocationList from "../../allocation/AllocationList";
import ClientRevenueChart from "./ClientRevenueChart";
import ClientRevenueTable from "./ClientRevenueTable";

type TabKey = "table" | "chart";

type Props = {
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    filters: Filters;
    branches: Branch[];
    organisationId: string;
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
            fetchClientRevenueDataPaged(this.props.pageOptions, this.props.sortOptions, this.props.filters)
        );

        if (this.props.branches.length === 0) this.props.dispatch(fetchBranches(this.props.organisationId));
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
            getClientRevenueData(this.props.filters, records => {
                this.setState({ downloading: false });
                downloadExcel(
                    records.items.map(d => {
                        delete d.rowNumber;
                        delete d.clientId;
                        d.clientDateOfBirth = d.clientDateOfBirth
                            ? moment(d.clientDateOfBirth).format(DATE_FORMAT)
                            : d.clientDateOfBirth;
                        return d;
                    }),
                    `ClientRevenue_${getMonthName(this.selectedMonth())}_${this.selectedYear()}.xlsx`
                );
            })
        );
    };

    render() {
        return (
            <>
                <Header
                    icon="line-chart"
                    actions={
                        <Row type="flex" gutter={10} align="middle">
                            <Col>
                                <Button
                                    icon="download"
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

                <Row type="flex" gutter={10} align="middle" justify="start">
                    <Col>Month Ending:</Col>
                    <Col>
                        <Select value={this.selectedMonth()} onChange={this.handleMonthChange} style={{ width: 125 }}>
                            {getMonthOptions().map(month => {
                                return (
                                    <Select.Option key={month.number.toString()} value={month.number}>
                                        {month.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select value={this.selectedYear()} onChange={this.handleYearChange} style={{ width: 90 }}>
                            {getYearOptions().map(year => {
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
                </Row>

                <Tabs onChange={this.onTabChange} activeKey={this.state.activeTab} sticky={true} tabBarGutter={0}>
                    <TabPane tab={<Icon type="table" className="mr-0" />} key="table">
                        <ClientRevenueTable editAllocations={this.editAllocations} />
                    </TabPane>
                    <TabPane tab={<Icon type="bar-chart" className="mr-0" />} key="chart" className="pt-0">
                        <ClientRevenueChart />
                    </TabPane>
                </Tabs>

                <Drawer
                    title={<ClientName prefix="Allocations to " clientId={this.state.editAllocationsClientId} />}
                    icon="share-alt"
                    noTopPadding={true}
                    visible={!!this.state.editAllocationsClientId}
                    onClose={this.closeEditAllocations}
                >
                    {this.state.editAllocationsClientId && (
                        <>
                            <AllocationList clientId={this.state.editAllocationsClientId} />
                            <DrawerFooter>
                                <Button onClick={this.closeEditAllocations}>Close</Button>
                            </DrawerFooter>
                        </>
                    )}
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientRevenueState = clientRevenueSelector(state);
    const branchesState = branchesSelector(state);
    const usersState = usersSimpleSelector(state);
    const policyTypesState = policyTypesSelector(state);

    return {
        pageOptions: clientRevenueState.pageOptions,
        sortOptions: clientRevenueState.sortOptions,
        filters: clientRevenueState.filters,
        organisationId: userOrganisationIdSelector(state),
        branches: branchesState.items,
        users: usersState.items,
        policyTypes: policyTypesState.items,
    };
};

export default connect(mapStateToProps)(ClientRevenueReport);
