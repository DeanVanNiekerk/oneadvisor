import { Table as TableAD } from 'antd';
import * as React from 'react';

type Props = {
    columns: any[];
    dataSource: any[];
    rowKey: string;
    loading?: boolean;
    onRowClick?: (record: any) => void;
    onChange?: (pagination: any, filters: any, sorter: any) => void;
};

const Table = (props: Props) => (
    <TableAD
        bordered
        columns={props.columns}
        dataSource={props.dataSource}
        rowKey={props.rowKey}
        loading={props.loading}
        onChange={props.onChange}
        pagination={{
            defaultPageSize: 10,
            showSizeChanger: true
        }}
        onRow={record => {
            return {
                onClick: () => {
                    if (props.onRowClick) props.onRowClick(record);
                }
            };
        }}
        size="small"
    />
);
Table.defaultProps = {
    loading: false
};

export { Table };
