// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const Wrapper = styled(Grid)`
    padding-top: 60px;
`;

const Text = styled(Typography)`
    padding-top: 10px !important;
`;

type Props = {
    text?: string,
};

const Loader = ({ text = 'loading...' }: Props) => {

    return (
        <Wrapper container direction="column" justify="center" alignItems="center">
            <Grid item>
                <CircularProgress color="secondary" />
            </Grid>
            <Grid item>
                <Text variant="body1">
                    {text}
                </Text>
            </Grid>
        </Wrapper>
    );
};

export default Loader;
