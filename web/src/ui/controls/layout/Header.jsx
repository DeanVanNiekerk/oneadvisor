// @flow

import * as React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

type Props = {
    children: React.Node,
    actions: React.Node
};

const Header = (props: Props) => (
    <Grid fluid>
        <Row between="xs">
            <Col>
                <h2>{props.children}</h2>
            </Col>
            <Col>{props.actions}</Col>
        </Row>
    </Grid>
);

export { Header };
