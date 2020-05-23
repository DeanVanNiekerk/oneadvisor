import { Table as TableAD } from "antd";
import { PaginationConfig } from "antd/lib/pagination";
import { ColumnProps } from "antd/lib/table";
import {
    Key,
    SorterResult,
    TablePaginationConfig,
    TableRowSelection,
} from "antd/lib/table/interface";
import React from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { defaultPageOptions } from "@/app/table/defaults";
import { RootState } from "@/state";
import { useCaseSelector } from "@/state/auth";

type Props<T extends object> = {
    columns: ColumnProps<T>[];
    dataSource: T[];
    rowKey: keyof T;
    loading?: boolean;
    useCases: string[];
    onRowClick?: (record: T, index: number) => void;
    onRowClickRequiredUseCase?: string;
    externalDataSource?: boolean;
    pageOptions?: PageOptions;
    hidePagination?: boolean;
    totalRows?: number;
    onTableChange?: (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => void;
    scroll?: {
        x?: number | true | string;
        y?: number | string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    footer?: (currentPageData: Record<string, any>[]) => React.ReactNode;
    rowSelection?: TableRowSelection<T>;
    header?: string;
    className?: string;
};

type State = {
    defaultPageOptions: PageOptions;
};

class TableComponent<T extends object> extends React.Component<Props<T>, State> {
    constructor(props) {
        super(props);

        this.state = {
            defaultPageOptions: defaultPageOptions(),
        };
    }

    handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, Key[] | null>,
        sorter: SorterResult<T> | SorterResult<T>[]
    ) => {
        //Check for table change
        if (this.props.onTableChange) {
            let sortResult: SorterResult<T>;

            if (Array.isArray(sorter)) {
                sortResult = (sorter as SorterResult<T>[])[0];
            } else {
                sortResult = sorter as SorterResult<T>;
            }

            this.props.onTableChange(
                {
                    number: pagination.current || this.state.defaultPageOptions.number,
                    size: pagination.pageSize || this.state.defaultPageOptions.size,
                },
                {
                    column: sortResult.field ? sortResult.field.toString() : "",
                    direction: sortResult.order === "ascend" ? "asc" : "desc",
                },
                filters as Filters
            );
        }
    };

    render() {
        let pagination: TablePaginationConfig | false = {
            defaultPageSize: this.state.defaultPageOptions.size,
            showSizeChanger: true,
        };

        const { pageOptions } = this.props;
        if (this.props.externalDataSource) {
            const options = pageOptions ? pageOptions : defaultPageOptions();

            pagination = {
                ...pagination,
                total: this.props.totalRows,
                pageSize: options.size,
                defaultPageSize: options.size,
                current: options.number,
            };
        }

        if (this.props.hidePagination) pagination = false;

        return (
            <TableAD<T>
                title={this.props.header ? () => this.props.header : undefined}
                bordered
                scroll={this.props.scroll}
                columns={this.props.columns}
                dataSource={this.props.dataSource}
                rowKey={this.props.rowKey.toString()}
                loading={this.props.loading}
                onChange={this.handleTableChange}
                pagination={pagination}
                footer={this.props.footer}
                rowSelection={this.props.rowSelection}
                className={this.props.className}
                showSorterTooltip={false}
                onRow={(record, index: number) => {
                    return {
                        onClick: () => {
                            if (
                                this.props.onRowClick &&
                                hasUseCase(
                                    this.props.onRowClickRequiredUseCase,
                                    this.props.useCases
                                )
                            )
                                this.props.onRowClick(record, index);
                        },
                    };
                }}
                size="small"
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

function getTable<T extends object>() {
    return connect(mapStateToProps)(TableComponent as new (props: Props<T>) => TableComponent<T>);
}

export { getTable };
