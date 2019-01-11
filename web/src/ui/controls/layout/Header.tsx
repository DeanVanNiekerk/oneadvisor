import { Col, Row, Skeleton } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    loading?: boolean;
    children: ReactNode;
    actions?: ReactNode;
};

const Header = (props: Props) => (
    <Row
        type="flex"
        style={{
            //position: 'sticky',
            //top: 0,
            //zIndex: 100,
            //backgroundColor: '#FFFFFF',
            paddingTop: 15
        }}
    >
        <Col span={12} className="content-header">
            <Skeleton
                loading={props.loading}
                title={false}
                active
                paragraph={{
                    rows: 1
                }}
            >
                <h2>{props.children}</h2>
            </Skeleton>
        </Col>
        {props.actions && (
            <Col span={12} className="text-right">
                {props.actions}
            </Col>
        )}
    </Row>
);

export { Header };
