import { Col, Row } from "antd";
import React, { ReactNode } from "react";

type Props = {
    label: ReactNode;
    value: ReactNode;
};

const PreviewCardRow: React.FC<Props> = (props: Props) => (
    <Row
        justify="space-between"
        style={{
            paddingTop: "2px",
            paddingBottom: "3px",
        }}
    >
        <Col
            style={{
                fontWeight: "normal",
            }}
        >
            {props.label}
        </Col>
        <Col>{props.value}</Col>
    </Row>
);

export { PreviewCardRow };
