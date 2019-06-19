import { Badge, Col, Icon, Row, Select } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { downloadExcel } from '@/app/excel/helpers';
import { hasUseCase } from '@/app/identity';
import { applyLike } from '@/app/query';
import { Filters, getColumnDefinition, PageOptions, SortOptions } from '@/app/table';
import { DATE_FORMAT, getMonthName, getMonthOptions, getYearOptions } from '@/app/utils';
import {
    ClientRevenueData, clientRevenueSelector, fetchClientRevenueData, getClientRevenueData, receiveClientRevenueFilters,
    receiveClientRevenuePageOptions, receiveClientRevenueSortOptions
} from '@/state/app/commission/reports';
import { Branch, branchesSelector, branchSelector, fetchBranches } from '@/state/app/directory/branches';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { useCaseSelector, userOrganisationIdSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Age, Button, ClientName, Drawer, DrawerFooter, getTable, Header } from '@/ui/controls';

import AllocationList from '../../allocation/AllocationList';

const Table = getTable<ClientRevenueData>();

type Props = {
    records: ClientRevenueData[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    useCases: string[];
    branches: Branch[];
    organisationId: string;
    users: UserSimple[];
} & DispatchProp;

type State = {
    editAllocationsClientId: string | null;
    downloading: boolean;
};

class ClientRevenueReport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            editAllocationsClientId: null,
            downloading: false,
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
            fetchClientRevenueData(
                this.props.pageOptions,
                this.props.sortOptions,
                this.updateFilters(this.props.filters)
            )
        );

        if (this.props.branches.length === 0) this.props.dispatch(fetchBranches(this.props.organisationId));
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["clientLastName"]);
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

    getColumns = () => {
        var getColumn = getColumnDefinition<ClientRevenueData>(true, this.props.filters);

        const columns = [
            getColumn(
                "clientLastName",
                "Last Name",
                {
                    showSearchFilter: true,
                },
                {
                    fixed: "left",
                }
            ),
            getColumn("clientInitials", "Initials"),
            getColumn(
                "clientDateOfBirth",
                "Age",
                {},
                {
                    render: (clientDateOfBirth: string) => {
                        return <Age dateOfBirth={clientDateOfBirth} />;
                    },
                }
            ),
            getColumn("monthlyAnnuityMonth", "Monthly As & When Commission", {
                type: "currency",
            }),
            getColumn("annualAnnuityAverage", "Annual Commissions Avg Monthly", {
                type: "currency",
            }),
            getColumn("totalMonthlyEarnings", "Total Monthly Earnings", {
                type: "currency",
            }),
            getColumn("lifeFirstYears", "Life Upfronts", {
                type: "currency",
            }),
            getColumn("onceOff", "Once Off Commissions", {
                type: "currency",
            }),
            getColumn("grandTotal", "Grand Total Last 12 Months", {
                type: "currency",
            }),
        ];

        if (hasUseCase("com_view_commission_allocations", this.props.useCases)) {
            columns.push(
                getColumn(
                    "rowNumber",
                    "",
                    {},
                    {
                        sorter: undefined,
                        fixed: "right",
                        render: (value: any, record: ClientRevenueData) => {
                            return (
                                <Badge dot count={record.allocationsCount}>
                                    <Icon type="share-alt" onClick={() => this.editAllocations(record.clientId)} />
                                </Badge>
                            );
                        },
                    }
                )
            );
        }

        return columns;
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
        return parseInt(this.props.filters.yearEnding[0]);
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
        return parseInt(this.props.filters.monthEnding[0]);
    };

    selectedBranchIds = (): string[] => {
        return this.props.filters.branchId;
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
        return this.props.filters.userId;
    };

    handleUserChange = (userIds: string[]) => {
        this.props.dispatch(
            receiveClientRevenueFilters({
                ...this.props.filters,
                userId: userIds,
            })
        );
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receiveClientRevenuePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveClientRevenueSortOptions(sortOptions));
        if (this.props.filters != filters)
            this.props.dispatch(
                receiveClientRevenueFilters({
                    ...this.props.filters,
                    ...filters,
                })
            );
    };

    download = () => {
        this.setState({ downloading: true });
        this.props.dispatch(
            getClientRevenueData(this.updateFilters(this.props.filters), records => {
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

                <Row type="flex" gutter={10} align="middle" justify="start" className="mb-1">
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
                            maxTagTextLength={15}
                            value={this.selectedBranchIds()}
                            onChange={this.handleBranchChange}
                            placeholder="Branch"
                            allowClear={true}
                            style={{ width: 260 }}
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
                            maxTagTextLength={15}
                            value={this.selectedUserIds()}
                            onChange={this.handleUserChange}
                            placeholder="Broker"
                            allowClear={true}
                            style={{ width: 260 }}
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
                </Row>

                <Table
                    rowKey="rowNumber"
                    columns={this.getColumns()}
                    dataSource={this.props.records}
                    loading={this.props.fetching}
                    onRowClick={() => {}}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    scroll={{
                        x: true,
                    }}
                />

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

    return {
        records: clientRevenueState.items,
        totalItems: clientRevenueState.totalItems,
        fetching: clientRevenueState.fetching || branchesState.fetching,
        pageOptions: clientRevenueState.pageOptions,
        sortOptions: clientRevenueState.sortOptions,
        filters: clientRevenueState.filters,
        useCases: useCaseSelector(state),
        organisationId: userOrganisationIdSelector(state),
        branches: branchesState.items,
        users: usersState.items,
    };
};

export default connect(mapStateToProps)(ClientRevenueReport);
