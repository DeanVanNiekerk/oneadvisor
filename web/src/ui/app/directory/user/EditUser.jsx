// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { showConfirm } from '@/ui/feedback/modal/confirm';

import UserForm from './UserForm';
import { Drawer, DrawerFooter, Button, ContentLoader } from '@/ui/controls';

import type { ReduxProps, RouterProps, ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';

import type { Organisation } from '@/state/app/directory/organisations/types';
import type { User } from '@/state/app/directory/users/types';
import { userSelector } from '@/state/app/directory/users/user/selectors';
import {
    fetchUser,
    updateUser,
    insertUser
} from '@/state/app/directory/users/user/actions';

type LocalProps = {
    visible: boolean,
    onClose: (cancelled: boolean) => void,
    user: User,
    organisations: Organisation[],
    fetching: boolean,
    updating: boolean,
    validationResults: ValidationResult[]
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    userEdited: User
};
class EditUser extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            userEdited: props.user
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.user != prevProps.user)
            this.setState({
                userEdited: this.props.user
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {

        if(this.props.user != this.state.userEdited)
            return showConfirm({ onOk: this.cancel })

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (this.state.userEdited.id) {
            this.props.dispatch(updateUser(this.state.userEdited, this.close));
        } else {
            this.props.dispatch(insertUser(this.state.userEdited, this.close));
        }
    };

    onChange = (user: User) => {
        this.setState({
            userEdited: user
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    render() {
        const { user, validationResults, visible } = this.props;

        return (
            <Drawer
                title={`${user && user.id ? 'Edit' : 'New'} User`}
                visible={visible}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    <UserForm
                        user={user}
                        validationResults={validationResults}
                        onChange={this.onChange}
                        organisations={this.props.organisations}
                    />
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState, props: RouterProps) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
        fetching: userState.fetching,
        updating: userState.updating,
        validationResults: userState.validationResults
    };
};

export default withRouter(connect(mapStateToProps)(EditUser));
