import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import { Application } from '@/state/app/directory/applications/types';
import { insertRole, RoleEdit, roleSelector, updateRole } from '@/state/app/directory/roles';
import { UseCase } from '@/state/app/directory/usecases';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import RoleForm from './RoleForm';

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    role: RoleEdit | null;
    applications: Application[];
    useCases: UseCase[];
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    roleEdited: RoleEdit | null;
};

class EditRole extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            roleEdited: props.role,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.role != prevProps.role) {
            this.setState({
                roleEdited: this.props.role,
            });
        }
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.role, this.state.roleEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.roleEdited) {
            this.close();
            return;
        }

        if (this.state.roleEdited.id) {
            this.props.dispatch(updateRole(this.state.roleEdited, this.close));
        } else {
            this.props.dispatch(insertRole(this.state.roleEdited, this.close));
        }
    };

    isLoading = () => {
        return this.props.fetching;
    };

    onChange = (role: RoleEdit) => {
        this.setState({
            roleEdited: role,
        });
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Role";

        const { role } = this.props;

        if (role && role.id) return `Edit Role: ${role.name}`;

        return "New Role";
    };

    render() {
        const { role, visible, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="safety-certificate"
                visible={visible}
                onClose={this.confirmCancel}
                noTopPadding={true}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {role && (
                        <RoleForm
                            role={role}
                            validationResults={validationResults}
                            onChange={this.onChange}
                            applications={this.props.applications}
                            useCases={this.props.useCases}
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
                        requiredUseCase="dir_edit_roles"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const roleState = roleSelector(state);

    return {
        role: roleState.role,
        fetching: roleState.fetching,
        updating: roleState.updating,
        validationResults: roleState.validationResults,
    };
};

export default connect(mapStateToProps)(EditRole);
