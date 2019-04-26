import { Badge, Col, Icon, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import { getMonthOptions, getYearOptions } from '@/app/utils';
import {
    ClientRevenueData, clientRevenueSelector, fetchClientRevenueData, receiveFilters, receivePageOptions,
    receiveSortOptions
} from '@/state/app/commission/reports';
import { useCaseSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Age, Button, ClientName, Drawer, DrawerFooter, Header, Table } from '@/ui/controls';

import AllocationList from '../../allocation/AllocationList';

type Props = {
    records: ClientRevenueData[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    useCases: string[];
} & DispatchProp;

type State = {
    editAllocationsClientId: string | null;
};

class ClientRevenueReport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            editAllocationsClientId: null,
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
        const columns = [
            getColumnEDS(
                "clientLastName",
                "Last Name",
                {
                    showSearchFilter: true,
                    fixed: "left",
                },
                this.props.filters
            ),
            getColumnEDS("clientInitials", "Initials"),
            getColumnEDS("clientDateOfBirth", "Age", {
                render: (clientDateOfBirth: string) => {
                    return <Age dateOfBirth={clientDateOfBirth} />;
                },
            }),
            getColumnEDS(
                "monthlyAnnuityMonth",
                "Monthly As & When Commission",
                {
                    type: "currency",
                }
            ),
            getColumnEDS(
                "annualAnnuityAverage",
                "Annual Commissions Ave. Monthly",
                {
                    type: "currency",
                }
            ),
            getColumnEDS("totalMonthlyEarnings", "Total Monthly Earnings", {
                type: "currency",
            }),
            getColumnEDS("lifeFirstYears", "Life Upfronts", {
                type: "currency",
            }),
            getColumnEDS("onceOff", "Once Off Commissions", {
                type: "currency",
            }),
            getColumnEDS("grandTotal", "Grand Total Last 12 Months", {
                type: "currency",
            }),
        ];

        if (
            hasUseCase("com_view_commission_allocations", this.props.useCases)
        ) {
            columns.push(
                getColumnEDS("actions", "", {
                    sorter: undefined,
                    fixed: "right",
                    render: (value: any, record: ClientRevenueData) => {
                        return (
                            <Badge dot count={record.allocationsCount}>
                                <Icon
                                    type="share-alt"
                                    onClick={() =>
                                        this.editAllocations(record.clientId)
                                    }
                                />
                            </Badge>
                        );
                    },
                })
            );
        }

        return columns;
    };

    handleYearChange = (year: number) => {
        this.props.dispatch(
            receiveFilters({
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
            receiveFilters({
                ...this.props.filters,
                monthEnding: [month.toString()],
            })
        );
    };

    selectedMonth = (): number => {
        return parseInt(this.props.filters.monthEnding[0]);
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
            this.props.dispatch(
                receiveFilters({
                    ...this.props.filters,
                    ...filters,
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
                            <Col>Month Ending:</Col>
                            <Col>
                                <Select
                                    value={this.selectedMonth()}
                                    onChange={this.handleMonthChange}
                                    style={{ width: 200 }}
                                >
                                    {getMonthOptions().map(month => {
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
                                    style={{ width: 200 }}
                                >
                                    {getYearOptions().map(year => {
                                        return (
                                            <Select.Option
                                                key={year.toString()}
                                                value={year}
                                            >
                                                {year}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    }
                >
                    Client Revenue Report
                </Header>

                <Table
                    rowKey="id"
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
                    title={
                        <ClientName
                            prefix="Allocations to "
                            clientId={this.state.editAllocationsClientId}
                        />
                    }
                    icon="share-alt"
                    noTopPadding={true}
                    visible={!!this.state.editAllocationsClientId}
                    onClose={this.closeEditAllocations}
                >
                    {this.state.editAllocationsClientId && (
                        <>
                            <AllocationList
                                clientId={this.state.editAllocationsClientId}
                            />
                            <DrawerFooter>
                                <Button onClick={this.closeEditAllocations}>
                                    Close
                                </Button>
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

    return {
        records: clientRevenueState.items,
        totalItems: clientRevenueState.totalItems,
        fetching: clientRevenueState.fetching,
        pageOptions: clientRevenueState.pageOptions,
        sortOptions: clientRevenueState.sortOptions,
        filters: clientRevenueState.filters,
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(ClientRevenueReport);
