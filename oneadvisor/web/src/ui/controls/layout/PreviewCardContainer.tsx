import { Row } from 'antd';
import React, { CSSProperties, ReactNode } from 'react';

const style: CSSProperties = {
    backgroundColor: "#ececec",
    padding: "20px",
};

type Props = {
    children: ReactNode;
};

const PreviewCardContainer = (props: Props) => (
    <div style={style}>
        <Row type="flex" gutter={16}>
            {props.children}
        </Row>
    </div>
);

export { PreviewCardContainer };
