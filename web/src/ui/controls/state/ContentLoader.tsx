import { Spin } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    isLoading: boolean,
    children: ReactNode
};

const ContentLoader = (props: Props) => (
    <Spin spinning={props.isLoading}>
        {props.children ? props.children : <div className="pt-3"></div>}
    </Spin>
);

export { ContentLoader };
