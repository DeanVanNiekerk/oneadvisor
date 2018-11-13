// @flow

import React, { Component } from 'react';
import UserForm from './UserForm';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Loader from '@/ui/common/Loader';
import Error from '@/ui/common/Error';
import { Content, Footer } from '@/ui/layout/main';
import { Button } from '@/ui/common/controls';

import type { ReduxProps, RouterProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { User } from '@/state/app/directory/users/types';
import { getCachedUser } from '@/state/app/directory/users/list/selectors';
import { userSelector } from '@/state/app/directory/users/user/selectors';
import { fetchUser } from '@/state/app/directory/users/user/actions';

type LocalProps = {
    user: User,
    fetching: boolean,
    error: boolean
};
type Props = LocalProps & RouterProps & ReduxProps;

class EditUser extends Component<Props> {
    componentDidMount() {
        if (!this.props.user)
            this.props.dispatch(fetchUser(this.props.match.params.userId));
    }

    cancel = () => {
        this.props.history.push(`/directory/users`);
    };

    render() {
        if (this.props.error) return <Error />;
        if (this.props.fetching || !this.props.user)
            return <Loader text="loading user..." />;

        return (
            <Content breadCrumb="Edit User">
                <UserForm user={this.props.user} />
                <Footer>
                    <Button color="default" onClick={() => this.cancel()}>
                        Cancel
                    </Button>
                    <Button color="primary">Save</Button>
                </Footer>
            </Content>
        );
    }
}

const mapStateToProps = (state: RootState, props: RouterProps) => ({
    user: getCachedUser(state, props) || userSelector(state).user,
    fetching: userSelector(state).fetching,
    error: userSelector(state).error
});

export default withRouter(connect(mapStateToProps)(EditUser));
