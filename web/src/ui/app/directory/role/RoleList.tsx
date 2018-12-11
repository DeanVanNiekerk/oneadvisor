import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Application, applicationsSelector, fetchApplications } from '@/state/app/directory/applications';
import { fetchRole, fetchRoles, Role, rolesSelector } from '@/state/app/directory/roles';
import { RootState } from '@/state/rootReducer';
import { getColumn } from '@/state/utils';
import { Header, Table } from '@/ui/controls';

import EditRole from './EditRole';

type Props = {
    roles: Role[];
    applications: Application[];
    fetching: boolean;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class RoleList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        if (this.props.roles.length === 0) this.loadRoles();

        if (this.props.applications.length === 0) this.loadApplications();
    }

    loadRoles = () => {
        this.props.dispatch(fetchRoles());
    };

    loadApplications = () => {
        this.props.dispatch(fetchApplications());
    };

    editRole = (id: string) => {
        this.props.dispatch(fetchRole(id));
        this.showEditRole();
    };

    getApplicationName = (id: string) => {
        const application = this.props.applications.find(u => u.id === id);
        if (application) return application.name;
    };

    showEditRole = () => {
        this.setState({
            editVisible: true
        });
    };

    closeEditRole = () => {
        this.setState({
            editVisible: false
        });
    };

    getColumns = () => {
        return [
            getColumn('email', 'Email'),
            getColumn('applicationId', 'Application', {
                render: (applicationId: string) => {
                    return this.getApplicationName(applicationId);
                }
            })
        ];
    };

    render() {
        return (
            <>
                <Header>Roles</Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.roles}
                    loading={this.props.fetching}
                    onRowClick={role => this.editRole(role.id)}
                />
                <EditRole
                    visible={this.state.editVisible}
                    onClose={this.closeEditRole}
                    applications={this.props.applications}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const rolesState = rolesSelector(state);
    const applicationsState = applicationsSelector(state);

    return {
        roles: rolesState.items,
        applications: applicationsState.items,
        fetching: rolesState.fetching || applicationsState.fetching
    };
};

export default connect(mapStateToProps)(RoleList);
