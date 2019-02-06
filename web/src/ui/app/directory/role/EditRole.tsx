import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Application } from '@/state/app/directory/applications/types';
import { RoleEdit, roleSelector } from '@/state/app/directory/roles';
import { UseCase } from '@/state/app/directory/usecases';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';

import RoleForm from './RoleForm';

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    role: RoleEdit | null;
    applications: Application[];
    useCases: UseCase[];
    fetching: boolean;
} & RouteComponentProps &
    DispatchProp;

class EditUser extends Component<Props> {
    close = () => {
        this.props.onClose(false);
    };

    isLoading = () => {
        return this.props.fetching;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Role';

        const { role } = this.props;

        if (role && role.id) return `View Role: ${role.name}`;

        return 'New Role';
    };

    render() {
        const { role, visible } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="safety-certificate"
                visible={visible}
                onClose={this.close}
                noTopPadding={true}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {role && (
                        <RoleForm
                            role={role}
                            applications={this.props.applications}
                            useCases={this.props.useCases}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={this.close} disabled={this.isLoading()}>
                        Close
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
        fetching: roleState.fetching
    };
};

export default withRouter(connect(mapStateToProps)(EditUser));
