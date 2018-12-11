import React, { ReactNode } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';

type Props = {
    children: ReactNode,
    actions: ReactNode
};

const Header = (props: Props) => (
    <Grid 
        fluid
        style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "#FFFFFF",
            paddingTop: 15
        }}
    >
        <Row between="xs">
            <Col>
                <h2>{props.children}</h2>
            </Col>
            <Col>{props.actions}</Col>
        </Row>
    </Grid>
);

export { Header };
