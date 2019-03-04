import { Icon, Popover } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import { formatCurrency, splitCamelCase } from '@/app/utils';
import {
    CommissionError, commissionErrorsSelector, CommissionImportData, fetchErrors, fetchMappingError, receivePageOptions,
    receiveSortOptions
} from '@/state/app/commission/errors';
import { Statement } from '@/state/app/commission/statements';
import { RootState } from '@/state/rootReducer';
import { Table } from '@/ui/controls';

import EditMappingError from '../mapping/EditMappingError';

type Props = {
    statement: Statement;
    errors: CommissionError[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    onUpdate: () => void;
} & DispatchProp;

class ErrorList extends Component<Props> {
    componentDidMount() {
        this.loadErrors();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions
        )
            this.loadErrors();

        if (
            this.props.pageOptions.number !== 1 &&
            this.props.errors.length === 0 &&
            prevProps.errors.length !== 0
        ) {
            this.props.dispatch(
                receivePageOptions({
                    ...this.props.pageOptions,
                    number: this.props.pageOptions.number - 1,
                })
            );
        }
    }

    loadErrors = () => {
        this.props.dispatch(
            fetchErrors(
                this.props.statement.id,
                this.props.pageOptions,
                this.props.sortOptions
            )
        );
        this.props.onUpdate();
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadErrors();
    };

    errorData = (data: CommissionImportData) => {
        return (
            <div>
                {Object.keys(data)
                    .filter(key => {
                        const value = data[key];
                        return value !== "" && value !== null;
                    })
                    .map(key => {
                        return (
                            <p>
                                <b>
                                    {splitCamelCase(key)}
                                    {": "}
                                </b>
                                {data[key]}
                            </p>
                        );
                    })}
            </div>
        );
    };

    getColumns = () => {
        return [
            getColumnEDS("data", "Policy Number", {
                render: (data: CommissionImportData) => {
                    return data.policyNumber;
                },
                sorter: false,
            }),
            getColumnEDS("data", "Amount Incl VAT", {
                render: (data: CommissionImportData) => {
                    return formatCurrency(data.amountIncludingVAT);
                },
                sorter: false,
            }),
            getColumnEDS("data", "VAT", {
                render: (data: CommissionImportData) => {
                    return formatCurrency(data.vat);
                },
                sorter: false,
            }),
            getColumnEDS("data", "Excel Data", {
                render: (data: CommissionImportData) => {
                    return (
                        <Popover
                            content={this.errorData(data)}
                            title="Excel Data"
                            placement="leftTop"
                            style={{
                                width: "450px",
                            }}
                        >
                            <Icon type="file-excel" />
                        </Popover>
                    );
                },
                sorter: false,
            }),
        ];
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveSortOptions(sortOptions));
    };

    resolveError = (id: string) => {
        if (this.props.statement === null) return;
        this.props.dispatch(fetchMappingError(this.props.statement.id, id));
    };

    render() {
        return (
            <>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.errors}
                    loading={this.props.fetching}
                    onRowClick={error => this.resolveError(error.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
                <EditMappingError
                    statement={this.props.statement}
                    remainingErrors={
                        this.props.statement
                            ? this.props.statement.mappingErrorCount
                            : 0
                    }
                    onUpdate={this.loadErrors}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const errorsState = commissionErrorsSelector(state);

    return {
        errors: errorsState.items,
        fetching: errorsState.fetching,
        pageOptions: errorsState.pageOptions,
        sortOptions: errorsState.sortOptions,
        totalItems: errorsState.totalItems,
    };
};

export default connect(mapStateToProps)(ErrorList);
