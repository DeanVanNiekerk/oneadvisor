import { Spin } from "antd";
import { SpinSize } from "antd/lib/spin";
import React from "react";
import { Col, Grid, Row } from "react-flexbox-grid";

type Props = {
    text?: string;
    size?: SpinSize;
    className?: string;
};

const Loader: React.FC<Props> = (props: Props) => (
    <Grid fluid className={props.className}>
        <Row style={{ height: "100%", alignItems: "center" }}>
            <Col xs={12}>
                <Row center="xs">
                    <Col>
                        <Spin size={props.size} spinning={true} />
                    </Col>
                </Row>
                {props.text && (
                    <Row center="xs" className="mt-1 mb-4">
                        <Col>{props.text}</Col>
                    </Row>
                )}
            </Col>
        </Row>
    </Grid>
);

export { Loader };
