import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    Application,
    applicationsSelector,
    fetchApplications,
} from "@/state/app/directory/applications";
import { Organisation } from "@/state/app/directory/organisations";
import { fetchRoles, Role, rolesSelector } from "@/state/app/directory/roles";
import { insertUser, updateUser, UserEdit, userSelector } from "@/state/app/directory/users";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import UserForm from "./UserForm";

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    user: UserEdit | null;
    applications: Application[];
    roles: Role[];
    organisations: Organisation[];
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    userEdited: UserEdit | null;
};
class EditUser extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            userEdited: props.user,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.user != prevProps.user) {
            this.setState({
                userEdited: this.props.user,
            });
        }
        if (this.props.visible != prevProps.visible && this.props.visible) this.loadLookupData();
    }

    loadLookupData() {
        if (this.props.roles.length === 0) this.loadRoles();

        if (this.props.applications.length === 0) this.loadApplications();
    }

    loadApplications = () => {
        this.props.dispatch(fetchApplications());
    };

    loadRoles = () => {
        this.props.dispatch(fetchRoles());
    };

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.user, this.state.userEdited))
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
            userEdited: user,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading User";

        const { user } = this.props;

        if (user && user.id) return `User: ${user.firstName} ${user.lastName}`;

        return "New User";
    };

    render() {
        const { user, validationResults, visible } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                iconName="user"
                visible={visible}
                onClose={this.confirmCancel}
                noTopPadding={true}
                footer={
                    <React.Fragment>
                        <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.save}
                            type="primary"
                            disabled={this.isLoading()}
                            requiredUseCase="dir_edit_users"
                        >
                            Save
                        </Button>
                    </React.Fragment>
                }
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {user && (
                        <UserForm
                            user={user}
                            validationResults={validationResults}
                            onChange={this.onChange}
                            organisations={this.props.organisations}
                            roles={this.props.roles}
                            applications={this.props.applications}
                        />
                    )}
                </ContentLoader>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);
    const applicationsState = applicationsSelector(state);
    const rolesState = rolesSelector(state);

    return {
        user: userState.user,
        applications: applicationsState.items,
        roles: rolesState.items,
        fetching: userState.fetching || applicationsState.fetching || rolesState.fetching,
        updating: userState.updating,
        validationResults: userState.validationResults,
    };
};

export default connect(mapStateToProps)(EditUser);
