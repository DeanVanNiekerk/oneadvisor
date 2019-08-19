import { Col, Row, Select } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { filterOption } from "@/app/controls/select";
import { downloadExcelSheets } from "@/app/excel/helpers";
import { getMonthOptions, getYearOptions, SERVER_DATE_FORMAT } from "@/app/utils";
import { CommissionEarningsType, commissionEarningsTypesSelector } from "@/state/app/commission/lookups";
import {
    fetchUserCompanyMonthlyCommissionData, fetchUserEarningsTypeMonthlyCommissionData,
    receiveUserCompanyMonthlyCommissionFilters, receiveUserEarningsTypeMonthlyCommissionFilters,
    receiveUserMonthlyCommissionMonth, receiveUserMonthlyCommissionUserMonthlyCommissionType,
    receiveUserMonthlyCommissionYear, UserCompanyMonthlyCommissionData, UserCompanyMonthlyCommissionFilters,
    userCompanyMonthlyCommissionSelector, UserEarningsTypeMonthlyCommissionData,
    UserEarningsTypeMonthlyCommissionFilters, userEarningsTypeMonthlyCommissionSelector, userMonthlyCommissionSelector,
    UserMonthlyCommissionType, UserMonthlyCommissionTypeOption
} from "@/state/app/commission/reports";
import {
    userEarningsTypeMonthlyCommissionItemsSelector
} from "@/state/app/commission/reports/userEarningsTypeMonthlyCommission/selectors";
import { organisationCompaniesSelector, Company } from "@/state/app/directory/lookups";
import { brokersSelector, UserSimple } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Button, Header } from "@/ui/controls";

import CompanyReport from "./company/CompanyReport";
import EarningsTypeReport from "./earningsType/EarningsTypeReport";

type Props = {
    earningsTypeRecords: UserEarningsTypeMonthlyCommissionData[];
    companyRecords: UserCompanyMonthlyCommissionData[];
    userEarningsTypeMonthlyCommissionFilters: UserEarningsTypeMonthlyCommissionFilters;
    userCompanyMonthlyMonthlyCommissionFilters: UserCompanyMonthlyCommissionFilters;
    users: UserSimple[];
    earningsTypeTotal: number;
    companies: Company[];
    commissionEarningsTypes: CommissionEarningsType[];
    selectedMonth: number;
    selectedYear: number;
    selectedType: UserMonthlyCommissionType;
    typeOptions: UserMonthlyCommissionTypeOption[];
} & DispatchProp;

class UserMonthlyCommissionReport extends Component<Props> {
    componentDidMount() {
        this.loadUserEarningsTypeMonthlyCommissionData();
        this.loadUserCompanyMonthlyCommissionData();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.userEarningsTypeMonthlyCommissionFilters !== this.props.userEarningsTypeMonthlyCommissionFilters)
            this.loadUserEarningsTypeMonthlyCommissionData();
        if (
            prevProps.userCompanyMonthlyMonthlyCommissionFilters !==
            this.props.userCompanyMonthlyMonthlyCommissionFilters
        )
            this.loadUserCompanyMonthlyCommissionData();

        if (prevProps.selectedType !== this.props.selectedType) {
            switch (this.props.selectedType) {
                case "Month":
                    this.handleMonthYearChange();
                    break;
                case "YearToDate":
                    this.handleYearToDateChange();
                    break;
                case "Last12Months":
                    this.handleLast12MonthsChange();
                    break;
            }
        }

        if (
            prevProps.selectedMonth !== this.props.selectedMonth ||
            prevProps.selectedYear !== this.props.selectedYear
        ) {
            this.handleMonthYearChange();
        }
    }

    loadUserEarningsTypeMonthlyCommissionData = () => {
        this.props.dispatch(
            fetchUserEarningsTypeMonthlyCommissionData(this.props.userEarningsTypeMonthlyCommissionFilters)
        );
    };

    loadUserCompanyMonthlyCommissionData = () => {
        this.props.dispatch(
            fetchUserCompanyMonthlyCommissionData(this.props.userCompanyMonthlyMonthlyCommissionFilters)
        );
    };

    handleUserChange = (userIds: string[]) => {
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.userEarningsTypeMonthlyCommissionFilters,
                userId: userIds,
            })
        );
        this.props.dispatch(
            receiveUserCompanyMonthlyCommissionFilters({
                ...this.props.userCompanyMonthlyMonthlyCommissionFilters,
                userId: userIds,
            })
        );
    };

    selectedUserIds = (): string[] => {
        return this.props.userEarningsTypeMonthlyCommissionFilters.userId || [];
    };

    handleCompanyChange = (companyIds: string[]) => {
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.userEarningsTypeMonthlyCommissionFilters,
                companyId: companyIds,
            })
        );
        this.props.dispatch(
            receiveUserCompanyMonthlyCommissionFilters({
                ...this.props.userCompanyMonthlyMonthlyCommissionFilters,
                companyId: companyIds,
            })
        );
    };

    selectedCompanyIds = (): string[] => {
        return this.props.userEarningsTypeMonthlyCommissionFilters.companyId || [];
    };

    handleYearChange = (year: number) => {
        this.props.dispatch(receiveUserMonthlyCommissionYear(year));
    };

    handleMonthChange = (month: number) => {
        this.props.dispatch(receiveUserMonthlyCommissionMonth(month));
    };

    handleDateRangeOptionChange = (type: UserMonthlyCommissionType) => {
        this.props.dispatch(receiveUserMonthlyCommissionUserMonthlyCommissionType(type));
    };

    handleMonthYearChange = () => {
        const start = moment(`${this.props.selectedYear}-${this.props.selectedMonth}-01`);
        const end = start.clone().endOf("month");
        this.updateDateFilters(start, end);
    };

    handleYearToDateChange = () => {
        const start = moment().startOf("year");
        const end = moment().endOf("month");
        this.updateDateFilters(start, end);
    };

    handleLast12MonthsChange = () => {
        const start = moment()
            .subtract(11, "months")
            .startOf("month");
        const end = moment().endOf("month");
        this.updateDateFilters(start, end);
    };

    updateDateFilters = (start: moment.Moment, end: moment.Moment) => {
        const startDate = start.format(SERVER_DATE_FORMAT);
        const endDate = end.format(SERVER_DATE_FORMAT);
        this.props.dispatch(
            receiveUserEarningsTypeMonthlyCommissionFilters({
                ...this.props.userEarningsTypeMonthlyCommissionFilters,
                startDate: [startDate],
                endDate: [endDate],
            })
        );
        this.props.dispatch(
            receiveUserCompanyMonthlyCommissionFilters({
                ...this.props.userCompanyMonthlyMonthlyCommissionFilters,
                startDate: [startDate],
                endDate: [endDate],
            })
        );
    };

    download = () => {
        let fileName = "BrokerCommission";

        const startDate = this.props.userEarningsTypeMonthlyCommissionFilters.startDate;
        const start = startDate ? startDate[0] : "";

        const endDate = this.props.userEarningsTypeMonthlyCommissionFilters.endDate;
        const end = endDate ? endDate[0] : "";

        fileName += `_${start}_${end}.xlsx`;

        downloadExcelSheets(
            [
                {
                    name: "Earnings Types",
                    data: this.props.earningsTypeRecords.map(d => ({
                        earningsType: this.getEarningsTypeName(d.commissionEarningsTypeId),
                        amountExcludingVAT: d.amountExcludingVAT,
                    })),
                },
                {
                    name: "Company",
                    data: this.props.companyRecords.map(d => ({
                        company: this.getCompanyName(d.companyId),
                        amountExcludingVAT: d.amountExcludingVAT,
                    })),
                },
            ],
            fileName
        );
    };

    getCompanyName = (companyId: string) => {
        const company = this.props.companies.find(c => c.id === companyId);
        if (company) return company.name;
        return "";
    };

    getEarningsTypeName = (earningsTypeId: string) => {
        const earningsType = this.props.commissionEarningsTypes.find(c => c.id === earningsTypeId);
        if (earningsType) return earningsType.name;
        return "";
    };

    render() {
        return (
            <>
                <Header
                    icon="pie-chart"
                    actions={
                        <Row type="flex" gutter={10} align="middle">
                            <Col>
                                <Button icon="download" onClick={this.download} noLeftMargin={true}>
                                    Download
                                </Button>
                            </Col>
                        </Row>
                    }
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
                            filterOption={filterOption}
                            placeholder="Broker"
                        >
                            {this.props.users.map(user => {
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
                            maxTagTextLength={15}
                            defaultValue={this.selectedCompanyIds()}
                            onChange={this.handleCompanyChange}
                            style={{ width: 260 }}
                            allowClear={true}
                            placeholder="Company"
                            filterOption={filterOption}
                        >
                            {this.props.companies.map(company => {
                                return (
                                    <Select.Option key={company.id} value={company.id}>
                                        {company.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select<UserMonthlyCommissionType>
                            value={this.props.selectedType}
                            onChange={this.handleDateRangeOptionChange}
                            style={{ width: 150 }}
                        >
                            {this.props.typeOptions.map(o => (
                                <Select.Option key={o.key} value={o.key}>
                                    {o.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    {this.props.selectedType === "Month" && (
                        <Col>
                            <Select<number>
                                value={this.props.selectedMonth}
                                onChange={this.handleMonthChange}
                                style={{ width: 125 }}
                            >
                                {getMonthOptions().map(month => {
                                    return (
                                        <Select.Option key={month.number.toString()} value={month.number}>
                                            {month.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Col>
                    )}
                    {this.props.selectedType === "Month" && (
                        <Col>
                            <Select<number>
                                value={this.props.selectedYear}
                                onChange={this.handleYearChange}
                                style={{ width: 90 }}
                            >
                                {getYearOptions().map(year => {
                                    return (
                                        <Select.Option key={year.toString()} value={year}>
                                            {year}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Col>
                    )}
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
    const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);
    const userMonthlyCommissionState = userMonthlyCommissionSelector(state);
    const companiesState = organisationCompaniesSelector(state);
    const commissionEarningsTypesState = commissionEarningsTypesSelector(state);

    return {
        earningsTypeRecords: userEarningsTypeMonthlyCommissionItemsSelector(state),
        userEarningsTypeMonthlyCommissionFilters: userEarningsTypeMonthlyCommissionState.filters,
        companyRecords: userCompanyMonthlyCommissionState.items,
        userCompanyMonthlyMonthlyCommissionFilters: userCompanyMonthlyCommissionState.filters,
        users: brokersSelector(state),
        companies: companiesState,
        commissionEarningsTypes: commissionEarningsTypesState.items,
        selectedMonth: userMonthlyCommissionState.month,
        selectedYear: userMonthlyCommissionState.year,
        selectedType: userMonthlyCommissionState.type,
        typeOptions: userMonthlyCommissionState.typeOptions,
    };
};

export default connect(mapStateToProps)(UserMonthlyCommissionReport);
