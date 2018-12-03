// @flow

import * as React from 'react';
import { Table as TableAD } from 'antd';

type Props = {
    columns: any[],
    dataSource: any[],
    rowKey: string,
    loading?: boolean,
    onRowClick?: (record: any) => void
};

const Table = (props: Props) => (
    <TableAD 
        bordered
        size="middle"
        columns={props.columns} 
        dataSource={props.dataSource} 
        rowKey={props.rowKey}
        loading={props.loading}
        pagination={{
            defaultPageSize: 10,
            showSizeChanger: true
        }}
        onRow={(record) => {
            return {
              onClick: () => {
                  if(props.onRowClick)
                    props.onRowClick(record);
              }
            };
        }}
    />
);
Table.defaultProps = {
    loading: false
}

export { Table };