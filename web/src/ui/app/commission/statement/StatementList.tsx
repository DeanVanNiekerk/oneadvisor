import { Tag } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import {
    fetchStatement, fetchStatements, receiveFilters, receivePageOptions, receiveSortOptions, receiveStatement,
    Statement, StatementEdit, statementsSelector
} from '@/state/app/commission/statements';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Button, CompanyName, Header, Table } from '@/ui/controls';

import EditStatement from './EditStatement';

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
    companies: Company[];
} & DispatchProp;

class StatementList extends Component<Props> {
    componentDidMount() {
        this.loadStatements();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadStatements();
    }

    loadStatements = () => {
        this.props.dispatch(
            fetchStatements(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    editStatement = (id: string) => {
        this.props.dispatch(fetchStatement(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadStatements();
    };

    newStatement = () => {
        const statement: StatementEdit = {
            id: '',
            amountIncludingVAT: 0,
            vat: 0,
            companyId: '',
            processed: false,
            date: ''
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
            getColumnEDS('amountIncludingVAT', 'Amount (incl VAT)', {
                type: 'currency'
            }),
            getColumnEDS('vat', 'VAT', { type: 'currency' }),
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

    render() {
        return (
            <>
                <Header
                    className="mb-1"
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
                        </>
                    }
                />
                {/* <Row type="flex" justify="space-around" className="mb-1">
                    <Col>
                        <Statistic
                            title="Total Amount"
                            prefix="R"
                            value={this.props.sumAmountIncludingVAT}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Average Amount"
                            prefix="R"
                            value={this.props.averageAmountIncludingVAT}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Total VAT"
                            prefix="R"
                            value={this.props.sumVAT}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Average VAT"
                            prefix="R"
                            value={this.props.averageVAT}
                        />
                    </Col>
                </Row> */}
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
        filters: statementsState.filters,
        companies: companiesState.items
    };
};

export default connect(mapStateToProps)(StatementList);
