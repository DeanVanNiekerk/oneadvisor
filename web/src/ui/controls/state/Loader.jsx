// @flow

import * as React from 'react';
import { Spin } from 'antd';

type Props = {
    isLoading: boolean,
    children: React.Node
};

const Loader = (props: Props) => (
    <Spin spinning={props.isLoading}>{props.children}</Spin>
);

export { Loader };
