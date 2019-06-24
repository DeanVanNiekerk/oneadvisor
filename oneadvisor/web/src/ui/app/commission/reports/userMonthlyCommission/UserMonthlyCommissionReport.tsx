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
import { companiesSelector, Company } from '@/state/app/directory/lookups';
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
    companies: Company[];
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

    handleUserChange = (userIds: string[]) => {
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.filters,
                userId: userIds,
            })
        );
    };

    selectedUserIds = (): string[] => {
        return this.props.filters.userId;
    };

    handleCompanyChange = (companyIds: string[]) => {
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.filters,
                companyId: companyIds,
            })
        );
    };

    selectedCompanyIds = (): string[] => {
        return this.props.filters.companyId;
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
                >
                    Broker Monthly Commission Report
                </Header>

                <Row type="flex" gutter={10} align="middle" justify="start">
                    <Col>
                        <Select
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={15}
                            defaultValue={this.selectedUserIds()}
                            onChange={this.handleUserChange}
                            style={{ width: 260 }}
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
                            mode="multiple"
                            maxTagCount={1}
                            maxTagTextLength={15}
                            defaultValue={this.selectedCompanyIds()}
                            onChange={this.handleCompanyChange}
                            style={{ width: 260 }}
                            allowClear={true}
                            placeholder="Company"
                        >
                            {this.props.companies.map(company => {
                                return (
                                    <Select.Option
                                        key={company.id}
                                        value={company.id}
                                    >
                                        {company.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            value={this.selectedMonth()}
                            onChange={this.handleMonthChange}
                            style={{ width: 125 }}
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
                            style={{ width: 90 }}
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
    const companiesState = companiesSelector(state);

    return {
        filters: userEarningsTypeMonthlyCommissionState.filters,
        users: usersState.items,
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(UserMonthlyCommissionReport);
