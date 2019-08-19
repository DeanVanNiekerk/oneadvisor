import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { ROLE_SUPER_ADMIN } from "@/config/role";
import { Application, applicationsSelector, fetchApplications } from "@/state/app/directory/applications";
import { fetchRole, fetchRoles, receiveRole, Role, RoleEdit, rolesSelector } from "@/state/app/directory/roles";
import { fetchUseCases, UseCase, useCasesSelector } from "@/state/app/directory/usecases";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header } from "@/ui/controls";

import EditRole from "./EditRole";

const Table = getTable<Role>();

type Props = {
    roles: Role[];
    applications: Application[];
    useCases: UseCase[];
    fetching: boolean;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class RoleList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.roles.length === 0) this.loadRoles();
        if (this.props.applications.length === 0) this.loadApplications();
        if (this.props.useCases.length === 0) this.loadUseCases();
    }

    loadRoles = () => {
        this.props.dispatch(fetchRoles());
    };

    loadApplications = () => {
        this.props.dispatch(fetchApplications());
    };

    loadUseCases = () => {
        this.props.dispatch(fetchUseCases());
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
            editVisible: true,
        });
    };

    closeEditRole = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadRoles();
    };

    newRole = () => {
        const role: RoleEdit = {
            id: "",
            name: "",
            description: "",
            applicationId: "",
            useCaseIds: [],
        };

        this.props.dispatch(receiveRole(role));
        this.showEditRole();
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<Role>();
        return [
            getColumn("name", "Name"),
            getColumn("description", "Description"),
            getColumn(
                "applicationId",
                "Application",
                {},
                {
                    render: (applicationId: string) => {
                        return this.getApplicationName(applicationId);
                    },
                    filters: this.props.applications.map(a => ({
                        text: a.name,
                        value: a.id,
                    })),
                }
            ),
        ];
    };

    render() {
        return (
            <>
                <Header
                    icon="safety-certificate"
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newRole}
                            disabled={this.props.fetching}
                            requiredRole={ROLE_SUPER_ADMIN}
                        >
                            New Role
                        </Button>
                    }
                >
                    Roles
                </Header>
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
                    useCases={this.props.useCases}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const rolesState = rolesSelector(state);
    const applicationsState = applicationsSelector(state);
    const useCaseState = useCasesSelector(state);

    return {
        roles: rolesState.items,
        applications: applicationsState.items,
        useCases: useCaseState.items,
        fetching: rolesState.fetching || applicationsState.fetching || useCaseState.fetching,
    };
};

export default connect(mapStateToProps)(RoleList);
