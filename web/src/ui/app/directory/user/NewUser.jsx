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
import { insertUser } from '@/state/app/directory/users/user/actions';
import { userSelector } from '@/state/app/directory/users/user/selectors';

type LocalProps = {
    fetching: boolean,
    updating: boolean,
    error: boolean,
    validationResults: ValidationResult[]
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    user: User
};
class NewUser extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        //Default new user values
        this.state = {
            user: {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                login: '',
                lastLogin: '',
                lastUpdated: '',
                lastUpdated: '',
                status: '',
                organisationId: ''
            }
        };
    }

    back = () => {
        this.props.history.push(`/directory/users`);
    };

    save = () => {
        this.props.dispatch(insertUser(this.state.user, this.back));
    };

    onChange = (user: User) => {
        this.setState({
          user: user
        });
    };

    render() {

        if (this.props.error) return <Error />;

        return (
            <>
                <Header breadCrumb="New User" />

                {this.props.updating && <Loader text="saving user..." />}

                {!this.props.updating && (
                    <>
                        <Content>
                            <UserForm
                                user={this.state.user}
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
    updating: userSelector(state).updating,
    error: userSelector(state).error,
    validationResults: userSelector(state).validationResults
});

export default withRouter(connect(mapStateToProps)(NewUser));
