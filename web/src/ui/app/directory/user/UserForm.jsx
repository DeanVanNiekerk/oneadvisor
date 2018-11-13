// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import styled, { css } from 'styled-components';

import type { User } from '@/state/app/directory/users/types';
import type { State as RootState } from '@/state/rootReducer';

const Form = styled(Grid)`
    padding: 10px;
    width: auto !important;
    margin: 0px !important;
`

type Props = {
    user: User
};

type State = {
    user: User
};

class UserForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: props.user
        };
    }

    componentDidMount() {}

    handleChange = name => event => {
        const user = {
            ...this.state.user,
            [name]: event.target.value
        };
        this.setState({
            user: user
        });
    };

    render() {
        return (
            <Form container spacing={24}>
                <Grid item xs={12}>
                    <TextField
                        label="First Name"
                        value={this.state.user.firstName}
                        onChange={this.handleChange('firstName')}
                        fullWidth={true}
                    />
                </Grid>
                 <Grid item xs={12}>
                    <TextField
                        label="Last Name"
                        value={this.state.user.lastName}
                        onChange={this.handleChange('lastName')}
                        fullWidth={true}
                    />
                </Grid>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => ({});

export default connect(mapStateToProps)(UserForm);
