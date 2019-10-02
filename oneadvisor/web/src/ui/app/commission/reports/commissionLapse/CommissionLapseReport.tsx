import { Col, Row, Select } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { PageOptions, SortOptions } from "@/app/table";
import { DATE_FORMAT, getMonthName, getMonthOptions, getYearOptions } from "@/app/utils";
import {
    CommissionLapseDataFilters, commissionLapseSelector, fetchCommissionLapseData, receiveCommissionLapseFilters
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { Header } from "@/ui/controls";

import CommissionLapseTable from "./CommissionLapseTable";

type Props = {
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    filters: CommissionLapseDataFilters;
} & DispatchProp;

class CommissionLapseReport extends Component<Props> {
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
        const sortOptions = this.mapSortOptions(this.props.sortOptions);
        this.props.dispatch(fetchCommissionLapseData(this.props.pageOptions, sortOptions, this.props.filters));
    };

    mapSortOptions = (sortOptions: SortOptions): SortOptions => {
        if (sortOptions.column === "companyId") {
            return {
                ...sortOptions,
                column: "companyName",
            };
        }
        return sortOptions;
    };

    currentFilterDate = () => {
        return moment(this.props.filters.date ? this.props.filters.date[0] : undefined);
    };

    handleYearChange = (year: number) => {
        this.props.dispatch(
            receiveCommissionLapseFilters({
                ...this.props.filters,
                date: [
                    this.currentFilterDate()
                        .year(year)
                        .format(DATE_FORMAT),
                ],
            })
        );
    };

    selectedYear = (): number => {
        return this.currentFilterDate().year();
    };

    handleMonthChange = (month: number) => {
        this.props.dispatch(
            receiveCommissionLapseFilters({
                ...this.props.filters,
                date: [
                    this.currentFilterDate()
                        .month(month - 1)
                        .format(DATE_FORMAT),
                ],
            })
        );
    };

    selectedMonth = (): number => {
        return this.currentFilterDate().month() + 1;
    };

    render() {
        return (
            <>
                <Header icon="alert">Policy Lapse Report</Header>

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
                </Row>

                <CommissionLapseTable />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionLapseState = commissionLapseSelector(state);

    return {
        pageOptions: commissionLapseState.pageOptions,
        sortOptions: commissionLapseState.sortOptions,
        filters: commissionLapseState.filters,
    };
};

export default connect(mapStateToProps)(CommissionLapseReport);
