// @flow

import * as React from 'react';
import { Table as TableAD } from 'antd';

type Props = {
    columns: any[],
    dataSource: any[],
    loading?: boolean
};

const Table = (props: Props) => (
    <TableAD 
        columns={props.columns} 
        dataSource={props.dataSource} 
        loading={props.loading}
    />
);
Table.defaultProps = {
    loading: false
}

export { Table };