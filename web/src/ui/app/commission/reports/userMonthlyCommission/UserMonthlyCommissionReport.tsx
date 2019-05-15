import { Col, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters } from '@/app/table';
import { getMonthOptions, getYearOptions } from '@/app/utils';
import {
    fetchUserCompanyMonthlyCommissionData, fetchUserEarningsTypeMonthlyCommissionData,
    receiveUserEarningsTypeMonthlyCommissionFilters, UserEarningsTypeMonthlyCommissionData,
    userEarningsTypeMonthlyCommissionSelector
} from '@/state/app/commission/reports';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Header } from '@/ui/controls';

import CompanyReport from './company/CompanyReport';
import EarningsTypeReport from './earningsType/EarningsTypeReport';

type Props = {
    earningsTypeRecords: UserEarningsTypeMonthlyCommissionData[];
    fetchingEarningsTypeRecords: boolean;
    filters: Filters;
    users: UserSimple[];
    earningsTypeTotal: number;
} & DispatchProp;

class UserMonthlyCommissionReport extends Component<Props> {
    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.filters != this.props.filters) this.loadData();
    }

    loadData = () => {
        this.props.dispatch(fetchUserEarningsTypeMonthlyCommissionData(this.props.filters));
        this.props.dispatch(fetchUserCompanyMonthlyCommissionData(this.props.filters));
    };

    handleUserChange = (userId: string) => {
        const userIdFilter: string[] = [];
        if (userId)
            userIdFilter.push(userId);

        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.filters,
                userId: userIdFilter,
            })
        );
    };

    selectedUserId = (): string | undefined => {
        if (this.props.filters.userId.length === 0) return undefined;

        return this.props.filters.userId[0];
    };

    handleYearChange = (year: number) => {
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
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
            receiveUserEarningsTypeMonthlyCommissionFilters({
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
                                    value={this.selectedUserId()}
                                    onChange={this.handleUserChange}
                                    style={{ width: 200 }}
                                    allowClear={true}
                                    placeholder="Broker"
                                >
                                    {this.props.users.map(user => {
                                        return (
                                            <Select.Option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.fullName}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Col>
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

                <Row gutter={32}>
                    <Col span={12}>
                        <EarningsTypeReport />
                    </Col>
                    <Col span={12}>
                        <CompanyReport />
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        filters: userEarningsTypeMonthlyCommissionState.filters,
        users: usersState.items,
    };
};

export default connect(mapStateToProps)(UserMonthlyCommissionReport);
