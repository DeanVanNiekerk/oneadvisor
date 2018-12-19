import { Table as TableAD } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { Filters, PageOptions, SortOptions } from '@/app/table';
import { defaultPageOptions } from '@/app/table/defaults';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

type Props = {
    columns: any[];
    dataSource: any[];
    rowKey: string;
    loading?: boolean;
    useCases: string[];
    onRowClick?: (record: any) => void;
    onRowClickRequiredUseCase?: string;

    //onChange?: (pagination: any, filters: any, sorter: any) => void;

    externalDataSource?: boolean;
    pageOptions?: PageOptions;
    totalRows?: number;
    onTableChange?: (
        pageOptions: PageOptions,
        sortOptions: SortOptions,
        filters: Filters
    ) => void;
};

type State = {
    defaultPageOptions: PageOptions;
};

class TableComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            defaultPageOptions: defaultPageOptions()
        };
    }

    handleTableChange = (
        pagination: PaginationConfig,
        filters: any,
        sorter
    ) => {
        //Check for table change
        if (this.props.onTableChange) {
            this.props.onTableChange(
                {
                    number:
                        pagination.current ||
                        this.state.defaultPageOptions.number,
                    size:
                        pagination.pageSize ||
                        this.state.defaultPageOptions.size
                },
                {
                    column: sorter.field,
                    direction: sorter.order === 'ascend' ? 'asc' : 'desc'
                },
                filters
            );
        }
    };

    render() {
        let pagination: PaginationConfig = {
            defaultPageSize: this.state.defaultPageOptions.size,
            showSizeChanger: true
        };

        const { pageOptions } = this.props;
        if (this.props.externalDataSource) {
            const options = pageOptions ? pageOptions : defaultPageOptions();

            pagination = {
                ...pagination,
                total: this.props.totalRows,
                pageSize: options.size,
                defaultPageSize: options.size,
                current: options.number
            };
        }

        return (
            <TableAD
                bordered
                columns={this.props.columns}
                dataSource={this.props.dataSource}
                rowKey={this.props.rowKey}
                loading={this.props.loading}
                onChange={this.handleTableChange}
                pagination={pagination}
                onRow={record => {
                    return {
                        onClick: () => {
                            if (
                                this.props.onRowClick &&
                                hasUseCase(
                                    this.props.onRowClickRequiredUseCase,
                                    this.props.useCases
                                )
                            )
                                this.props.onRowClick(record);
                        }
                    };
                }}
                size="small"
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = identitySelector(state);

    return {
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

const Table = connect(mapStateToProps)(TableComponent);

export { Table };
