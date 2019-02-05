import { Col, Row, Select, Tag } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import { formatCurrency, getMonthDateRange } from '@/app/utils';
import {
    fetchStatements, receiveFilterMonth, receiveFilters, receiveFilterYear, receivePageOptions, receiveSortOptions,
    receiveStatement, Statement, StatementEdit, statementsSelector
} from '@/state/app/commission/statements';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Button, CompanyName, Header, Table } from '@/ui/controls';

import EditStatement from './EditStatement';

const Option = Select.Option;

type Props = {
    statements: Statement[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    sumAmountIncludingVAT: number;
    sumVAT: number;
    averageAmountIncludingVAT: number;
    averageVAT: number;
    filters: Filters;
    filterMonth: number;
    filterYear: number;
    companies: Company[];
} & RouteComponentProps &
    DispatchProp;

class StatementList extends Component<Props> {
    componentDidMount() {
        this.loadStatements();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters ||
            prevProps.filterMonth != this.props.filterMonth ||
            prevProps.filterYear != this.props.filterYear
        )
            this.loadStatements();
    }

    loadStatements = () => {
        const dateRange = getMonthDateRange(
            this.props.filterMonth,
            this.props.filterYear
        );

        this.props.dispatch(
            fetchStatements(this.props.pageOptions, this.props.sortOptions, {
                ...this.props.filters,
                startDate: [dateRange.start],
                endDate: [dateRange.end]
            })
        );
    };

    editStatement = (id: string) => {
        this.props.history.push(`/commission/statements/${id}`);
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadStatements();
    };

    newStatement = () => {
        let today = moment();
        let date = moment()
            .year(this.props.filterYear)
            .month(this.props.filterMonth - 1);
        if (today.year() !== date.year() || today.month() !== date.month())
            date = date.date(1);

        const statement: StatementEdit = {
            id: '',
            amountIncludingVAT: 0,
            vat: 0,
            companyId: '',
            processed: false,
            date: date.format()
        };
        this.props.dispatch(receiveStatement(statement));
    };

    getColumns = () => {
        return [
            getColumnEDS('companyId', 'Company', {
                render: (companyId: string) => {
                    return <CompanyName companyId={companyId} />;
                },
                filters: this.props.companies.map(type => ({
                    text: type.name,
                    value: type.id
                }))
            }),
            getColumnEDS('date', 'Date', { type: 'date' }),
            getColumnEDS('actualAmountIncludingVAT', 'Amount (incl VAT)', {
                type: 'currency'
            }),
            getColumnEDS('actualVAT', 'VAT', { type: 'currency' }),
            getColumnEDS('processed', 'Status', {
                render: (processed: boolean) => {
                    if (processed) return <Tag color="green">Processed</Tag>;

                    return <Tag color="purple">Processing</Tag>;
                },
                filters: [
                    {
                        text: 'Processed',
                        value: 'true'
                    },
                    {
                        text: 'Processing',
                        value: 'false'
                    }
                ]
            })
        ];
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
            this.props.dispatch(receiveFilters(filters));
    };

    getMonths = () => {
        return moment.months().map((m, i) => {
            return {
                number: i + 1,
                name: m
            };
        });
    };

    getYears = () => {
        let years: number[] = [];
        const thisYear = moment().year();
        for (let i = thisYear - 20; i <= thisYear; i++) {
            years.push(i);
        }
        return years.reverse();
    };

    handleMonthChange = (month: number) => {
        this.props.dispatch(receiveFilterMonth(month));
    };

    handleYearChange = (year: number) => {
        this.props.dispatch(receiveFilterYear(year));
    };

    nextMonth = () => {
        let month = this.props.filterMonth + 1;
        if (month > 12) {
            month = 1;
            this.props.dispatch(receiveFilterYear(this.props.filterYear + 1));
        }
        this.props.dispatch(receiveFilterMonth(month));
    };

    previousMonth = () => {
        let month = this.props.filterMonth - 1;
        if (month < 1) {
            month = 12;
            this.props.dispatch(receiveFilterYear(this.props.filterYear - 1));
        }
        this.props.dispatch(receiveFilterMonth(month));
    };

    tableFooter = () => {
        return (
            <Row type="flex" justify="space-between">
                <Col>
                    <b>Total Amount (incl VAT): </b>
                    {formatCurrency(this.props.sumAmountIncludingVAT)}
                </Col>
                <Col>
                    <b>Total VAT: </b>
                    {formatCurrency(this.props.sumVAT)}
                </Col>
                <Col>
                    <b>Average Amount (incl VAT): </b>
                    {formatCurrency(this.props.averageAmountIncludingVAT)}
                </Col>
                <Col>
                    <b>Average VAT: </b>
                    {formatCurrency(this.props.averageVAT)}
                </Col>
            </Row>
        );
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newStatement}
                            disabled={this.props.fetching}
                            requiredUseCase="com_edit_commission_statements"
                        >
                            Add Statement
                        </Button>
                    }
                >
                    Commission Statements
                </Header>
                <Row type="flex" justify="center" className="mb-1" gutter={24}>
                    <Col>
                        <Button
                            shape="circle"
                            icon="left"
                            size="large"
                            onClick={this.previousMonth}
                            noLeftMargin={true}
                        />
                    </Col>
                    <Col>
                        <Select
                            size="large"
                            value={this.props.filterMonth}
                            onChange={this.handleMonthChange}
                            style={{ width: 200 }}
                        >
                            {this.getMonths().map(month => {
                                return (
                                    <Option
                                        key={month.number.toString()}
                                        value={month.number}
                                    >
                                        {month.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            size="large"
                            value={this.props.filterYear}
                            onChange={this.handleYearChange}
                            style={{ width: 200 }}
                        >
                            {this.getYears().map(year => {
                                return (
                                    <Option key={year.toString()} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Button
                            shape="circle"
                            icon="right"
                            size="large"
                            onClick={this.nextMonth}
                            noLeftMargin={true}
                        />
                    </Col>
                </Row>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.statements}
                    loading={this.props.fetching}
                    onRowClick={statement => this.editStatement(statement.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    footer={this.tableFooter}
                />
                <EditStatement onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const statementsState = statementsSelector(state);
    const companiesState = companiesSelector(state);

    return {
        statements: statementsState.items,
        fetching: statementsState.fetching,
        pageOptions: statementsState.pageOptions,
        sortOptions: statementsState.sortOptions,
        totalItems: statementsState.totalItems,
        sumAmountIncludingVAT: statementsState.sumAmountIncludingVAT,
        sumVAT: statementsState.sumVAT,
        averageAmountIncludingVAT: statementsState.averageAmountIncludingVAT,
        averageVAT: statementsState.averageVAT,
        filterMonth: statementsState.filterMonth,
        filterYear: statementsState.filterYear,
        filters: statementsState.filters,
        companies: companiesState.items
    };
};

export default withRouter(connect(mapStateToProps)(StatementList));
