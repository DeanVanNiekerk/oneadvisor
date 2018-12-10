import { Spin } from 'antd';
import * as React from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';



type Props = {
    text?: string,
};

const Loader = (props: Props) => (
    <Grid fluid>
        <Row>
            <Col xs={12}>
                <Row center="xs">
                    <Col>
                        <Spin
                            spinning={true}
                            style={{ marginTop: '50px' }}
                        ></Spin>
                    </Col>
                </Row>
                {props.text && (
                    <Row center="xs">
                        <Col>{props.text}</Col>
                    </Row>
                )}
            </Col>
        </Row>
    </Grid>
);

export { Loader };
