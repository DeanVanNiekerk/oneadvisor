// @flow

import React, { Component } from 'react';
import UserForm from './UserForm';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';

import { Loader, Error, Footer, Content, Header } from '@/ui/controls';

import type { ReduxProps, RouterProps, ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { User } from '@/state/app/directory/users/types';
import { getCachedUser } from '@/state/app/directory/users/list/selectors';
import { userSelector } from '@/state/app/directory/users/user/selectors';
import {
    fetchUser,
    updateUser
} from '@/state/app/directory/users/user/actions';

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

        this.state = {
            userEdited: null
        };
    }

    componentDidMount() {
        if (!this.props.user)
            this.props.dispatch(fetchUser(this.props.match.params.userId));
    }

    back = () => {
        this.props.history.push(`/directory/users`);
    };

    save = () => {
        if (this.state.userEdited)
            this.props.dispatch(updateUser(this.state.userEdited, this.back));
        else this.back();
    };

    onChange = (user: User) => {
        this.setState({
            userEdited: user
        });
    };

    canSave = () => {
        return this.state.userEdited !== null && !this.props.updating;
    };

    isLoading = () => {
        return this.props.fetching 
                || !this.props.user;
    };

    render() {
        if (this.props.error) return <Error />;

        return (
            <>
                <Header breadCrumb="Edit User" />

                {this.isLoading() && <Loader text="loading user..." />}

                {!this.isLoading() && (
                    <>
                        <Content>
                            <UserForm
                                user={this.props.user}
                                validationResults={this.props.validationResults}
                                onChange={this.onChange}
                            />
                        </Content>

                        <Footer>
                            <Button
                                color="secondary"
                                className="mr-1"
                                onClick={this.back}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={this.save}
                                disabled={this.props.updating}
                            >
                                {this.props.updating ? 'Saving...' : 'Save'}
                            </Button>
                        </Footer>
                    </>
                )}
            </>
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
