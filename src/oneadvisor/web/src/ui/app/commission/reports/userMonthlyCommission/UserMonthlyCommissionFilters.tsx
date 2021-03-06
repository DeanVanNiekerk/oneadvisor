import { Col, Row, Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { filterOption } from "@/app/controls/select";
import { useDidUpdateEffect } from "@/app/hooks";
import { getMonthOptions, getYearOptions, SERVER_DATE_FORMAT } from "@/app/utils";
import { RootState } from "@/state";
import {
    fetchUserCompanyMonthlyCommissionData,
    fetchUserEarningsTypeMonthlyCommissionData,
    receiveUserCompanyMonthlyCommissionBranchFilter,
    receiveUserCompanyMonthlyCommissionCompanyFilter,
    receiveUserCompanyMonthlyCommissionDateRangeFilter,
    receiveUserCompanyMonthlyCommissionUserFilter,
    receiveUserEarningsTypeMonthlyCommissionBranchFilter,
    receiveUserEarningsTypeMonthlyCommissionCompanyFilter,
    receiveUserEarningsTypeMonthlyCommissionDateRangeFilter,
    receiveUserEarningsTypeMonthlyCommissionUserFilter,
    receiveUserMonthlyCommissionMonth,
    receiveUserMonthlyCommissionUserMonthlyCommissionType,
    receiveUserMonthlyCommissionYear,
    userCompanyMonthlyCommissionSelector,
    userEarningsTypeMonthlyCommissionSelector,
    userMonthlyCommissionSelector,
    UserMonthlyCommissionType,
} from "@/state/commission/reports";
import { branchesSimpleSelector, organisationCompaniesSelector } from "@/state/lookups/directory";
import { brokersSelector } from "@/state/lookups/directory/usersSimple";

type Props = PropsFromState & PropsFromDispatch;

const UserMonthlyCommissionFilters: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchUserEarningsTypeMonthlyCommissionData();
    }, [props.userEarningsTypeMonthlyCommissionFilters]);

    useEffect(() => {
        props.fetchUserCompanyMonthlyCommissionData();
    }, [props.userCompanyMonthlyMonthlyCommissionFilters]);

    useDidUpdateEffect(() => {
        onMonthYearChange();
    }, [props.selectedYear, props.selectedMonth]);

    useDidUpdateEffect(() => {
        switch (props.selectedType) {
            case "Month":
                onMonthYearChange();
                break;
            case "YearToDate":
                onYearToDateChange();
                break;
            case "Last12Months":
                onLast12MonthsChange();
                break;
        }
    }, [props.selectedType]);

    const selectedUserIds = (): string[] => {
        return props.userEarningsTypeMonthlyCommissionFilters.userId || [];
    };

    const selectedCompanyIds = (): string[] => {
        return props.userEarningsTypeMonthlyCommissionFilters.companyId || [];
    };

    const selectedBranchIds = (): string[] => {
        return props.userEarningsTypeMonthlyCommissionFilters.branchId || [];
    };

    const onMonthYearChange = () => {
        const start = dayjs(`${props.selectedYear}-${props.selectedMonth}-01`);
        const end = start.clone().endOf("month");
        props.onDateFiltersChange(start, end);
    };

    const onYearToDateChange = () => {
        const start = dayjs().startOf("year");
        const end = dayjs().endOf("month");
        props.onDateFiltersChange(start, end);
    };

    const onLast12MonthsChange = () => {
        const start = dayjs().subtract(11, "month").startOf("month");
        const end = dayjs().endOf("month");
        props.onDateFiltersChange(start, end);
    };

    return (
        <Row gutter={10} align="middle" justify="start">
            <Col>
                <Select
                    mode="multiple"
                    maxTagCount={1}
                    maxTagTextLength={15}
                    defaultValue={selectedUserIds()}
                    onChange={props.onUserChange}
                    style={{ width: 260 }}
                    allowClear={true}
                    filterOption={filterOption}
                    placeholder="Broker"
                >
                    {props.users.map((user) => {
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
                    defaultValue={selectedBranchIds()}
                    onChange={props.onBranchesChange}
                    style={{ width: 260 }}
                    allowClear={true}
                    placeholder="Branch"
                    filterOption={filterOption}
                >
                    {props.branches.map((branch) => {
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
                    defaultValue={selectedCompanyIds()}
                    onChange={props.onCompanyChange}
                    style={{ width: 260 }}
                    allowClear={true}
                    placeholder="Company"
                    filterOption={filterOption}
                >
                    {props.companies.map((company) => {
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
                    value={props.selectedType}
                    onChange={props.onDateRangeOptionChange}
                    style={{ width: 150 }}
                >
                    {props.typeOptions.map((o) => (
                        <Select.Option key={o.key} value={o.key}>
                            {o.label}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            {props.selectedType === "Month" && (
                <Col>
                    <Select<number>
                        value={props.selectedMonth}
                        onChange={props.onMonthChange}
                        style={{ width: 125 }}
                    >
                        {getMonthOptions().map((month) => {
                            return (
                                <Select.Option key={month.number.toString()} value={month.number}>
                                    {month.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Col>
            )}
            {props.selectedType === "Month" && (
                <Col>
                    <Select<number>
                        value={props.selectedYear}
                        onChange={props.onYearChange}
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
            )}
        </Row>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(state);
    const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);
    const userMonthlyCommissionState = userMonthlyCommissionSelector(state);
    const companiesState = organisationCompaniesSelector(state);
    const branchesState = branchesSimpleSelector(state);

    return {
        userEarningsTypeMonthlyCommissionFilters: userEarningsTypeMonthlyCommissionState.filters,
        userCompanyMonthlyMonthlyCommissionFilters: userCompanyMonthlyCommissionState.filters,
        selectedType: userMonthlyCommissionState.type,
        typeOptions: userMonthlyCommissionState.typeOptions,
        selectedMonth: userMonthlyCommissionState.month,
        selectedYear: userMonthlyCommissionState.year,
        users: brokersSelector(state),
        companies: companiesState,
        branches: branchesState.items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators(
            { fetchUserEarningsTypeMonthlyCommissionData, fetchUserCompanyMonthlyCommissionData },
            dispatch
        ),
        onUserChange: (userIds: string[]) => {
            dispatch(receiveUserCompanyMonthlyCommissionUserFilter(userIds));
            dispatch(receiveUserEarningsTypeMonthlyCommissionUserFilter(userIds));
        },
        onCompanyChange: (companyIds: string[]) => {
            dispatch(receiveUserCompanyMonthlyCommissionCompanyFilter(companyIds));
            dispatch(receiveUserEarningsTypeMonthlyCommissionCompanyFilter(companyIds));
        },
        onBranchesChange: (branchIds: string[]) => {
            dispatch(receiveUserCompanyMonthlyCommissionBranchFilter(branchIds));
            dispatch(receiveUserEarningsTypeMonthlyCommissionBranchFilter(branchIds));
        },
        onDateRangeOptionChange: (type: UserMonthlyCommissionType) => {
            dispatch(receiveUserMonthlyCommissionUserMonthlyCommissionType(type));
        },
        onYearChange: (year: number) => {
            dispatch(receiveUserMonthlyCommissionYear(year));
        },
        onMonthChange: (month: number) => {
            dispatch(receiveUserMonthlyCommissionMonth(month));
        },
        onDateFiltersChange: (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
            const startDate = start.format(SERVER_DATE_FORMAT);
            const endDate = end.format(SERVER_DATE_FORMAT);
            dispatch(receiveUserCompanyMonthlyCommissionDateRangeFilter(startDate, endDate));
            dispatch(receiveUserEarningsTypeMonthlyCommissionDateRangeFilter(startDate, endDate));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMonthlyCommissionFilters);
