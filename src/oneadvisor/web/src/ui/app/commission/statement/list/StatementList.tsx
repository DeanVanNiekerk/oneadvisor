import { Button as ButtonAD, Col, Dropdown, Menu, Row, Select } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { areEqual, formatCurrency, getMonthOptions, getYearOptions } from "@/app/utils";
import {
    CommissionErrorsFilters,
    downloadCommissionErrors,
    getCommissionErrors,
} from "@/state/commission/errors";
import {
    clearStatementPreview,
    fetchStatements,
    newStatement,
    receiveFilterMonth,
    receiveFilters,
    receiveFilterYear,
    receivePageOptions,
    receiveSortOptions,
    Statement,
    statementsSelector,
    statementVisible,
    updateMonthFilterNext,
    updateMonthFilterPrevious,
} from "@/state/commission/statements";
import { organisationCompaniesSelector } from "@/state/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Button, CompanyName, getTable, Header } from "@/ui/controls";
import { DownOutlined, FileExclamationOutlined } from "@ant-design/icons";

import EditStatement from "../form/EditStatement";
import { Processed } from "./Processed";

const Table = getTable<Statement>();

const Option = Select.Option;

type Props = PropsFromState & PropsFromDispatch & RouteComponentProps;

const StatementList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchStatements();
    }, [props.pageOptions, props.sortOptions, props.filters, props.filterMonth, props.filterYear]);

    const editStatement = (id: string) => {
        props.clearStatementPreview();
        props.history.push(`/commission/statements/${id}`);
    };

    const getColumns = () => {
        const getColumn = getColumnDefinition<Statement>(true, props.filters, props.sortOptions);

        return [
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: props.companies.map((type) => ({
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

    const onTableChange = (
        pageOptions: PageOptions,
        sortOptions: SortOptions,
        filters: Filters
    ) => {
        if (!areEqual(props.pageOptions, pageOptions)) props.updatePageOptions(pageOptions);
        if (!areEqual(props.sortOptions, sortOptions)) props.updateSortOptions(sortOptions);
        if (!areEqual(props.filters, filters)) props.updateFilters(filters);
    };

    const handleMonthChange = (month: number) => {
        props.updateMonthFilter(month);
    };

    const handleYearChange = (year: number) => {
        props.updateYearFilter(year);
    };

    const tableFooter = () => {
        return (
            <Row justify="space-between">
                <Col>
                    <b>Total Amount (excl VAT): </b>
                    {formatCurrency(props.sumAmountIncludingVAT - props.sumVAT)}
                </Col>
            </Row>
        );
    };

    const downloadMappingErrors = () => {
        const filters: CommissionErrorsFilters = {
            commissionStatementMonth: [props.filterMonth.toString()],
            commissionStatementYear: [props.filterYear.toString()],
        };
        const date = `${props.filterYear}-${props.filterMonth}-01`;

        props.downloadMappingErrors(filters, date);
    };

    const actionsMenu = (
        <Menu>
            <Menu.Item onClick={downloadMappingErrors}>
                <FileExclamationOutlined />
                Download Mapping Errors
            </Menu.Item>
            {/* 
            Disabled until we work out how to handle template selection (what if there is more than one template?)
            <Menu.Item onClick={reimportCommissions}>
                <Icon type="reload" />
                Reimport Commission Statements
            </Menu.Item> */}
        </Menu>
    );

    return (
        <>
            <Header
                iconName="reconciliation"
                actions={
                    <>
                        <Button
                            type="default"
                            iconName="plus"
                            onClick={props.newStatement}
                            disabled={props.fetching}
                            requiredUseCase="com_edit_commission_statements"
                        >
                            Add Statement
                        </Button>
                        <Dropdown overlay={actionsMenu}>
                            <ButtonAD>
                                Actions <DownOutlined />
                            </ButtonAD>
                        </Dropdown>
                    </>
                }
            >
                Commission Statements
            </Header>
            <Row justify="center" className="mb-1" gutter={24}>
                <Col>
                    <Button
                        shape="circle"
                        iconName="left"
                        size="large"
                        onClick={props.updateMonthFilterPrevious}
                        noLeftMargin={true}
                    />
                </Col>
                <Col>
                    <Select
                        size="large"
                        value={props.filterMonth}
                        onChange={handleMonthChange}
                        style={{ width: 200 }}
                    >
                        {getMonthOptions().map((month) => {
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
                        value={props.filterYear}
                        onChange={handleYearChange}
                        style={{ width: 200 }}
                    >
                        {getYearOptions().map((year) => {
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
                        iconName="right"
                        size="large"
                        onClick={props.updateMonthFilterNext}
                        noLeftMargin={true}
                    />
                </Col>
            </Row>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.statements}
                loading={props.fetching}
                onRowClick={(statement) => editStatement(statement.id)}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
                footer={tableFooter}
            />
            <EditStatement onSaved={props.fetchStatements} />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
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

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators(
            {
                fetchStatements,
                clearStatementPreview,
                updateMonthFilterNext,
                updateMonthFilterPrevious,
            },
            dispatch
        ),
        newStatement: () => {
            dispatch(newStatement());
            dispatch(statementVisible(true));
        },
        updatePageOptions: (pageOptions: PageOptions) => {
            dispatch(receivePageOptions(pageOptions));
        },
        updateSortOptions: (sortOptions: SortOptions) => {
            dispatch(receiveSortOptions(sortOptions));
        },
        updateFilters: (filters: Filters) => {
            dispatch(receiveFilters(filters));
        },
        updateMonthFilter: (month: number) => {
            dispatch(receiveFilterMonth(month));
        },
        updateYearFilter: (year: number) => {
            dispatch(receiveFilterYear(year));
        },
        downloadMappingErrors: (filters: CommissionErrorsFilters, date: string) => {
            dispatch(
                getCommissionErrors(filters, (errors) => {
                    downloadCommissionErrors(errors, "", moment(date).format("MMM-YYYY"));
                })
            );
        },
        /*
        reimportCommissions = () => {
            confirm({
                title: "Are you sure you want to reimport all commission entries for this month?",
                content:
                    "All existing commission entries including any errors will be deleted before import, are you sure you wish to continue?",
                onOk: () => {
                    showMessage("loading", "Reimporting commission entries", 200);
                    const dateRange = getMonthDateRange(props.filterMonth, props.filterYear);
                    props.dispatch(
                        bulkReimportCommissions(
                            dateRange.start,
                            dateRange.end,
                            //Success
                            () => {
                                showMessage("success", "Commission entries successfully imported", 5, true);
                            },
                            //Failure
                            () => {
                                setState({ reimportingCommissionEntries: false });
                                showMessage("error", "Error importing commission entries", 5, true);
                            }
                        )
                    );
                },
            });
        };
        */
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StatementList));
