import { Col, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters, getColumn } from '@/app/table';
import { getMonthOptions, getYearOptions } from '@/app/utils';
import {
    fetchUserCompanyMonthlyCommissionData, fetchUserEarningsTypeMonthlyCommissionData,
    receiveUserEarningsTypeMonthlyCommissionFilters, UserCompanyMonthlyCommissionData,
    userCompanyMonthlyCommissionSelector, UserEarningsTypeMonthlyCommissionData,
    userEarningsTypeMonthlyCommissionSelector
} from '@/state/app/commission/reports';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { CommissionEarningsTypeName, CompanyName, Header, Table } from '@/ui/controls';

type Props = {
    earningsTypeRecords: UserEarningsTypeMonthlyCommissionData[];
    companyRecords: UserCompanyMonthlyCommissionData[];
    fetchingEarningsTypeRecords: boolean;
    fetchingCompanyRecords: boolean;
    filters: Filters;
    users: UserSimple[];
} & DispatchProp;

class UserMonthlyCommissionReport extends Component<Props> {
    componentDidMount() {
        this.checkSelectedUser();
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.users != this.props.users) {
            this.checkSelectedUser();
        }

        if (prevProps.filters != this.props.filters) this.loadData();
    }

    checkSelectedUser = () => {
        if (!this.selectedUserId()) {
            if (this.props.users.length !== 0) {
                this.handleUserChange(this.props.users[0].id);
            }
        }
    };

    loadData = () => {
        if (!this.selectedUserId()) return;
        this.props.dispatch(fetchUserEarningsTypeMonthlyCommissionData(this.props.filters));
        this.props.dispatch(fetchUserCompanyMonthlyCommissionData(this.props.filters));
    };

    getEarningsTypeColumns = () => {
        return [
            getColumn("commissionEarningsTypeId", "Type", {
                render: (commissionEarningsTypeId: string) => {
                    return (
                        <CommissionEarningsTypeName
                            commissionEarningsTypeId={commissionEarningsTypeId}
                        />
                    );
                },
            }),
            getColumn("amountIncludingVAT", "Amount", {
                type: "currency",
            }),
        ];
    };

    getCompanyColumns = () => {
        return [
            getColumn("companyId", "Company", {
                render: (companyId: string) => {
                    return (
                        <CompanyName
                            companyId={companyId}
                        />
                    );
                },
            }),
            getColumn("amountIncludingVAT", "Amount", {
                type: "currency",
            }),
        ];
    };

    handleUserChange = (userId: string) => {
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.filters,
                userId: [userId],
            })
        );
    };

    selectedUserId = (): string => {
        if (this.props.filters.userId.length === 0) return "";

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

                <Row gutter={24}>
                    <Col span={12}>
                        <Table
                            header="By Commission Earnings Type"
                            rowKey="commissionEarningsTypeId"
                            columns={this.getEarningsTypeColumns()}
                            dataSource={this.props.earningsTypeRecords}
                            loading={this.props.fetchingEarningsTypeRecords}
                            hidePagination={true}
                        />

                    </Col>
                    <Col span={12}>
                        <Table
                            header="By Company"
                            rowKey="companyId"
                            columns={this.getCompanyColumns()}
                            dataSource={this.props.companyRecords}
                            loading={this.props.fetchingCompanyRecords}
                        />
                    </Col>
                </Row>



            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(state);
    const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        earningsTypeRecords: userEarningsTypeMonthlyCommissionState.items,
        fetchingEarningsTypeRecords: userEarningsTypeMonthlyCommissionState.fetching,
        companyRecords: userCompanyMonthlyCommissionState.items,
        fetchingCompanyRecords: userCompanyMonthlyCommissionState.fetching,
        filters: userEarningsTypeMonthlyCommissionState.filters,
        users: usersState.items,
    };
};

export default connect(mapStateToProps)(UserMonthlyCommissionReport);
