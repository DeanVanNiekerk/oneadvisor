import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Organisation } from '@/state/app/directory/organisations/types';
import { UserEdit } from '@/state/app/directory/users/types';
import {
    insertUser, updateUser
} from '@/state/app/directory/users/user/actions';
import { userSelector } from '@/state/app/directory/users/user/selectors';
import { RootState } from '@/state/rootReducer';
import { ValidationResult } from '@/state/types';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import UserForm from './UserForm';

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    user: UserEdit | null;
    organisations: Organisation[];
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & RouteComponentProps &
    DispatchProp;

type State = {
    userEdited: UserEdit | null;
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

    onChange = (user: UserEdit) => {
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
