import { Tag } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { ROLE_SUPER_ADMIN } from "@/config/role";
import { RootState } from "@/state";
import { Application, applicationsSelector } from "@/state/context";
import {
    fetchRole,
    fetchRoles,
    receiveRole,
    Role,
    RoleEdit,
    rolesSelector,
} from "@/state/directory/roles";
import { fetchUseCases, UseCase, useCasesSelector } from "@/state/directory/usecases";
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
        if (this.props.useCases.length === 0) this.loadUseCases();
    }

    loadRoles = () => {
        this.props.dispatch(fetchRoles());
    };

    loadUseCases = () => {
        this.props.dispatch(fetchUseCases());
    };

    editRole = (id: string) => {
        this.props.dispatch(fetchRole(id));
        this.showEditRole();
    };

    getApplicationName = (id: string) => {
        const application = this.props.applications.find((u) => u.id === id);
        if (application) return application.name;
    };

    getApplicationColor = (id: string) => {
        const application = this.props.applications.find((u) => u.id === id);
        if (application) return application.colourHex;
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
            id: null,
            name: "",
            description: "",
            applicationId: "",
            useCaseIds: [],
        };

        this.props.dispatch(receiveRole(role));
        this.showEditRole();
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<Role>();
        return [
            getColumn("name", "Name"),
            getColumn("description", "Description"),
            getColumn(
                "applicationId",
                "Application",
                {},
                {
                    render: (applicationId: string) => {
                        return (
                            <Tag color={this.getApplicationColor(applicationId)}>
                                {this.getApplicationName(applicationId)}
                            </Tag>
                        );
                    },
                    filters: this.props.applications.map((a) => ({
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
                    iconName="safety-certificate"
                    actions={
                        <Button
                            type="default"
                            iconName="plus"
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
                    onRowClick={(role) => this.editRole(role.id)}
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
        applications: applicationsState,
        useCases: useCaseState.items,
        fetching: rolesState.fetching || useCaseState.fetching,
    };
};

export default connect(mapStateToProps)(RoleList);
