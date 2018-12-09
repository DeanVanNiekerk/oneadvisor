import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { showConfirm } from '@/ui/feedback/modal/confirm';

import UserForm from './UserForm';
import { Drawer, DrawerFooter, Button, ContentLoader } from '@/ui/controls';

import { ValidationResult } from '@/state/types';
import { State as RootState } from '@/state/rootReducer';

import { Organisation } from '@/state/app/directory/organisations/types';
import { User } from '@/state/app/directory/users/types';
import { userSelector } from '@/state/app/directory/users/user/selectors';
import {
    updateUser,
    insertUser
} from '@/state/app/directory/users/user/actions';

type Props= {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    user: User | null;
    organisations: Organisation[];
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & RouteComponentProps & DispatchProp;

type State = {
    userEdited: User | null;
};
class EditUser extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            userEdited: props.user
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.user != prevProps.user)
            this.setState({
                userEdited: this.props.user
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (this.props.user != this.state.userEdited)
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.userEdited) {
            this.close();
            return;
        }

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
                    {user && (
                        <UserForm
                            user={user}
                            validationResults={validationResults}
                            onChange={this.onChange}
                            organisations={this.props.organisations}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button
                        onClick={this.confirmCancel}
                        disabled={this.isLoading()}
                    >
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

const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);

    return {
        user: userState.user,
        fetching: userState.fetching,
        updating: userState.updating,
        validationResults: userState.validationResults
    };
};

export default withRouter(connect(mapStateToProps)(EditUser));
