// @flow

import React, { Component } from 'react';
import UserForm from './UserForm';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Loader from '@/ui/common/Loader';
import Error from '@/ui/common/Error';
import { Content, Footer } from '@/ui/layout/main';
import { Button } from '@/ui/common/controls';

import type { ReduxProps, RouterProps, ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { User } from '@/state/app/directory/users/types';
import { getCachedUser } from '@/state/app/directory/users/list/selectors';
import { userSelector } from '@/state/app/directory/users/user/selectors';
import { fetchUser, updateUser } from '@/state/app/directory/users/user/actions';

type LocalProps = {
    user: User,
    fetching: boolean,
    updating: boolean,
    error: boolean,
    validationResults: ValidationResult[]
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    userEdited: ?User
};
class EditUser extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        console.log('constructor', props.user);

        this.state = {
            userEdited: props.user
        };
    }

    componentDidMount() {
        if (!this.props.user)
            this.props.dispatch(fetchUser(this.props.match.params.userId));
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps.user);
        this.setState({
            userEdited: nextProps.user
        });
    }

    back = () => {
        this.props.history.push(`/directory/users`);
    };

    save = () => {
        if(this.state.userEdited)
            this.props.dispatch(updateUser(this.state.userEdited, this.back));
    };

    onChange = (user: User) => {
        console.log('onChange', user);
        this.setState({
            userEdited: user
        })
    };

    render() {
        if (this.props.error) return <Error />;
        if (this.props.fetching || this.props.updating || !this.state.userEdited)
            return <Loader entity="user" fetching={this.props.fetching} updating={this.props.updating} />;

        return (
            <Content breadCrumb="Edit User">
                <UserForm user={this.state.userEdited} validationResults={this.props.validationResults} onChange={this.onChange} />
                <Footer>
                    <Button color="default" onClick={this.back}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={this.save} disabled={this.state.userEdited === null}>Save</Button>
                </Footer>
            </Content>
        );
    }
}

const mapStateToProps = (state: RootState, props: RouterProps) => ({
    user: getCachedUser(state, props) || userSelector(state).user,
    fetching: userSelector(state).fetching,
    updating: userSelector(state).updating,
    error: userSelector(state).error,
    validationResults: userSelector(state).validationResults
});

export default withRouter(connect(mapStateToProps)(EditUser));
