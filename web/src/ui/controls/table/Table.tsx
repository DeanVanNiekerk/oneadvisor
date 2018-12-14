import { Table as TableAD } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';

import { defaultPageOptions } from '@/app/table/defaults';
import { PageOptions, SortOptions } from '@/app/types';

type Props = {
    columns: any[];
    dataSource: any[];
    rowKey: string;
    loading?: boolean;
    onRowClick?: (record: any) => void;
    onChange?: (pagination: any, filters: any, sorter: any) => void;

    externalDataSource?: boolean;
    pageOptions?: PageOptions;
    totalRows?: number;
    onTableChange?: (
        pageOptions: PageOptions,
        sortOptions: SortOptions
    ) => void;
};

type State = {
    defaultPageOptions: PageOptions;
};

class Table extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            defaultPageOptions: defaultPageOptions()
        };
    }

    handleTableChange = (pagination: PaginationConfig, filters, sorter) => {
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
                }
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
                            if (this.props.onRowClick)
                                this.props.onRowClick(record);
                        }
                    };
                }}
                size="small"
            />
        );
    }
}

export { Table };
