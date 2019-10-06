import { Button as ButtonAD, Col, Dropdown, Icon, Menu, Modal, Row, Select } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { formatCurrency, getMonthDateRange, getMonthOptions, getYearOptions } from "@/app/utils";
import { CommissionErrorsFilters, downloadCommissionErrors, getCommissionErrors } from "@/state/app/commission/errors";
import {
    bulkReimportCommissions, clearStatementPreview, fetchStatements, receiveFilterMonth, receiveFilters,
    receiveFilterYear, receivePageOptions, receiveSortOptions, receiveStatement, Statement, StatementEdit,
    statementsSelector
} from "@/state/app/commission/statements";
import { Company, organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Button, CompanyName, getTable, Header } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

import EditStatement from "./EditStatement";
import { Processed } from "./Processed";

const confirm = Modal.confirm;

const Table = getTable<Statement>();

const Option = Select.Option;

type Props = {
    statements: Statement[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    sumAmountIncludingVAT: number;
    sumVAT: number;
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
        const dateRange = getMonthDateRange(this.props.filterMonth, this.props.filterYear);
        const sortOptions = this.mapSortOptions(this.props.sortOptions);

        this.props.dispatch(
            fetchStatements(this.props.pageOptions, sortOptions, {
                ...this.props.filters,
                startDate: [dateRange.start],
                endDate: [dateRange.end],
            })
        );
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

    editStatement = (id: string) => {
        this.props.dispatch(clearStatementPreview());
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
        if (today.year() !== date.year() || today.month() !== date.month()) date = date.date(1);

        const statement: StatementEdit = {
            id: "",
            amountIncludingVAT: 0,
            vat: 0,
            companyId: "",
            processed: false,
            date: date.format(),
        };
        this.props.dispatch(receiveStatement(statement));
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<Statement>(true, this.props.filters, this.props.sortOptions);

        return [
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: this.props.companies.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("date", "Date", { type: "date" }),
            getColumn(
                "actualAmountIncludingVAT",
                "Amount (excl VAT)",
                {},
                {
                    render: (actualAmountIncludingVAT: number, record: Statement) => {
                        return formatCurrency(actualAmountIncludingVAT - record.actualVAT);
                    },
                }
            ),
            getColumn("commissionCount", "Commission Count"),
            getColumn("mappingErrorCount", "Error Count"),
            getColumn(
                "processed",
                "Status",
                {},
                {
                    render: (processed: boolean) => {
                        return <Processed processed={processed} />;
                    },
                    filters: [
                        {
                            text: "Processed",
                            value: "true",
                        },
                        {
                            text: "Processing",
                            value: "false",
                        },
                    ],
                }
            ),
        ];
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters) this.props.dispatch(receiveFilters(filters));
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
                    <b>Total Amount (excl VAT): </b>
                    {formatCurrency(this.props.sumAmountIncludingVAT - this.props.sumVAT)}
                </Col>
            </Row>
        );
    };

    downloadMappingErrors = () => {
        const filters: CommissionErrorsFilters = {
            commissionStatementMonth: [this.props.filterMonth.toString()],
            commissionStatementYear: [this.props.filterYear.toString()],
        };

        this.props.dispatch(
            getCommissionErrors(filters, errors => {
                downloadCommissionErrors(
                    errors,
                    "",
                    moment(`${this.props.filterYear}-${this.props.filterMonth}-01`).format("MMM-YYYY")
                );
            })
        );
    };

    reimportCommissions = () => {
        confirm({
            title: "Are you sure you want to reimport all commission entries for this month?",
            content:
                "All existing commission entries including any errors will be deleted before import, are you sure you wish to continue?",
            onOk: () => {
                showMessage("loading", "Reimporting commission entries", 200);
                const dateRange = getMonthDateRange(this.props.filterMonth, this.props.filterYear);
                this.props.dispatch(
                    bulkReimportCommissions(
                        dateRange.start,
                        dateRange.end,
                        //Success
                        () => {
                            showMessage("success", "Commission entries successfully imported", 5, true);
                        },
                        //Failure
                        () => {
                            this.setState({ reimportingCommissionEntries: false });
                            showMessage("error", "Error importing commission entries", 5, true);
                        }
                    )
                );
            },
        });
    };

    render() {
        const actionsMenu = (
            <Menu>
                <Menu.Item onClick={this.downloadMappingErrors}>
                    <Icon type="file-exclamation" />
                    Download Mapping Errors
                </Menu.Item>
                {/* 
                Disabled until we work out how to handle template selection (what if there is more than one template?)
                <Menu.Item onClick={this.reimportCommissions}>
                    <Icon type="reload" />
                    Reimport Commission Statements
                </Menu.Item> */}
            </Menu>
        );

        return (
            <>
                <Header
                    icon="reconciliation"
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newStatement}
                                disabled={this.props.fetching}
                                requiredUseCase="com_edit_commission_statements"
                            >
                                Add Statement
                            </Button>
                            <Dropdown overlay={actionsMenu}>
                                <ButtonAD>
                                    Actions <Icon type="down" />
                                </ButtonAD>
                            </Dropdown>
                        </>
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
                            {getMonthOptions().map(month => {
                                return (
                                    <Option key={month.number.toString()} value={month.number}>
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
                            {getYearOptions().map(year => {
                                return (
                                    <Option key={year.toString()} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Button shape="circle" icon="right" size="large" onClick={this.nextMonth} noLeftMargin={true} />
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
    const companiesState = organisationCompaniesSelector(state);

    return {
        statements: statementsState.items,
        fetching: statementsState.fetching,
        pageOptions: statementsState.pageOptions,
        sortOptions: statementsState.sortOptions,
        totalItems: statementsState.totalItems,
        sumAmountIncludingVAT: statementsState.sumAmountIncludingVAT,
        sumVAT: statementsState.sumVAT,
        filterMonth: statementsState.filterMonth,
        filterYear: statementsState.filterYear,
        filters: statementsState.filters,
        companies: companiesState,
    };
};

export default withRouter(connect(mapStateToProps)(StatementList));
