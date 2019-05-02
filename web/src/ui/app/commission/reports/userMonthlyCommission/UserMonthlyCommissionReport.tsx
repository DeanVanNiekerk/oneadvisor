import { Badge, Col, Icon, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters, getColumnEDS } from '@/app/table';
import { getMonthOptions, getYearOptions } from '@/app/utils';
import {
    fetchUserMonthlyCommissionData, receiveUserMonthlyCommissionFilters, userMonthlyCommissionSelector
} from '@/state/app/commission/reports';
import { RootState } from '@/state/rootReducer';
import { Header } from '@/ui/controls';

type Props = {
    //records: ClientRevenueData[];
    fetching: boolean;
    totalItems: number;
    filters: Filters;
} & DispatchProp;

type State = {
    userId: string | null;
};

class UserMonthlyCommissionReport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.filters != this.props.filters) this.loadData();
    }

    loadData = () => {
        this.props.dispatch(fetchUserMonthlyCommissionData(this.props.filters));
    };

    // getColumns = () => {
    //     const columns = [
    //         getColumnEDS(
    //             "clientLastName",
    //             "Last Name",
    //             {
    //                 showSearchFilter: true,
    //                 fixed: "left",
    //             },
    //             this.props.filters
    //         ),
    //         getColumnEDS("clientInitials", "Initials"),
    //         getColumnEDS("clientDateOfBirth", "Age", {
    //             render: (clientDateOfBirth: string) => {
    //                 return <Age dateOfBirth={clientDateOfBirth} />;
    //             },
    //         }),
    //         getColumnEDS(
    //             "monthlyAnnuityMonth",
    //             "Monthly As & When Commission",
    //             {
    //                 type: "currency",
    //             }
    //         ),
    //         getColumnEDS(
    //             "annualAnnuityAverage",
    //             "Annual Commissions Ave. Monthly",
    //             {
    //                 type: "currency",
    //             }
    //         ),
    //         getColumnEDS("totalMonthlyEarnings", "Total Monthly Earnings", {
    //             type: "currency",
    //         }),
    //         getColumnEDS("lifeFirstYears", "Life Upfronts", {
    //             type: "currency",
    //         }),
    //         getColumnEDS("onceOff", "Once Off Commissions", {
    //             type: "currency",
    //         }),
    //         getColumnEDS("grandTotal", "Grand Total Last 12 Months", {
    //             type: "currency",
    //         }),
    //     ];

    //     return columns;
    // };

    handleYearChange = (year: number) => {
        this.props.dispatch(
            receiveUserMonthlyCommissionFilters({
                ...this.props.filters,
                year: [year.toString()],
            })
        );
    };

    selectedYear = (): number => {
        return parseInt(this.props.filters.year[0]);
    };

    handleMonthChange = (month: number) => {
        this.props.dispatch(
            receiveUserMonthlyCommissionFilters({
                ...this.props.filters,
                month: [month.toString()],
            })
        );
    };

    selectedMonth = (): number => {
        return parseInt(this.props.filters.month[0]);
    };

    render() {
        return (
            <>
                <Header
                    icon="pie-chart"
                    actions={
                        <Row type="flex" gutter={10} align="middle">
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
                    Broker Monthly Commission Report
                </Header>

                {/* <Table
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
                /> */}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userMonthlyCommissionState = userMonthlyCommissionSelector(state);

    return {
        //records: userMonthlyCommissionState.items,
        totalItems: userMonthlyCommissionState.totalItems,
        fetching: userMonthlyCommissionState.fetching,
        filters: userMonthlyCommissionState.filters,
    };
};

export default connect(mapStateToProps)(UserMonthlyCommissionReport);
