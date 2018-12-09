

import React, { ReactNode } from 'react';
import { Spin } from 'antd';

type Props = {
    isLoading: boolean,
    children: ReactNode
};

const ContentLoader = (props: Props) => (
    <Spin spinning={props.isLoading}>
        {props.children}
    </Spin>
);

export { ContentLoader };
