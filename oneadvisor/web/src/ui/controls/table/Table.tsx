import { Table as TableAD } from "antd";
import { ColumnProps, PaginationConfig, TableRowSelection } from "antd/lib/table";
import * as React from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { Filters, PageOptions, SortOptions } from "@/app/table";
import { defaultPageOptions } from "@/app/table/defaults";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

type Props<T> = {
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
        x?: boolean | number | string;
        y?: boolean | number | string;
    };
    footer?: (currentPageData: Object[]) => React.ReactNode;
    rowSelection?: TableRowSelection<T>;
    header?: string;
    className?: string;
};

type State = {
    defaultPageOptions: PageOptions;
};

class TableComponent<T> extends React.Component<Props<T>, State> {
    constructor(props) {
        super(props);

        this.state = {
            defaultPageOptions: defaultPageOptions(),
        };
    }

    handleTableChange = (pagination: PaginationConfig, filters: any, sorter: any) => {
        //Check for table change
        if (this.props.onTableChange) {
            this.props.onTableChange(
                {
                    number: pagination.current || this.state.defaultPageOptions.number,
                    size: pagination.pageSize || this.state.defaultPageOptions.size,
                },
                {
                    column: sorter.field,
                    direction: sorter.order === "ascend" ? "asc" : "desc",
                },
                filters
            );
        }
    };

    render() {
        let pagination: PaginationConfig | false = {
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
            <TableAD
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
                onRow={(record, index: number) => {
                    return {
                        onClick: () => {
                            if (
                                this.props.onRowClick &&
                                hasUseCase(this.props.onRowClickRequiredUseCase, this.props.useCases)
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

function getTable<T = any>() {
    return connect(mapStateToProps)(TableComponent as new (props: Props<T>) => TableComponent<T>);
}

export { getTable };
