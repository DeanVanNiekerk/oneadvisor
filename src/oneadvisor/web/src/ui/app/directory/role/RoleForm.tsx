import { Badge, List, Switch } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { getValidationSubSet, ValidationResult } from "@/app/validation";
import { hasRole, ROLE_SUPER_ADMIN } from "@/config/role";
import { RootState } from "@/state";
import { roleSelector } from "@/state/auth";
import { Application } from "@/state/directory/applications/types";
import { RoleEdit } from "@/state/directory/roles";
import { UseCase } from "@/state/directory/usecases";
import { Form, FormErrors, FormInput, FormSelect, TabPane, Tabs } from "@/ui/controls";

type TabKey = "details_tab" | "usecases_tab";

type Props = {
    role: RoleEdit;
    applications: Application[];
    useCases: UseCase[];
    onChange: (role: RoleEdit) => void;
    roles: string[];
    validationResults: ValidationResult[];
};

type State = {
    role: RoleEdit;
    activeTab: TabKey;
};

class RoleForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            role: props.role,
            activeTab: "details_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.role != prevProps.role)
            this.setState({
                role: this.props.role,
                activeTab: "details_tab", //Reset the tab
            });
    }

    handleChange = (fieldName: keyof RoleEdit, value: string | string[]) => {
        const role = update(this.state.role, { [fieldName]: { $set: value } });
        this.setState({
            role: role,
        });
        this.props.onChange(role);
    };

    handleApplicationChange = (fieldName: keyof RoleEdit, value: string) => {
        const role = {
            ...this.state.role,
            useCaseIds: [], //Clear use case ids
        };
        this.setState(
            {
                role: role,
            },
            () => {
                this.handleChange(fieldName, value);
            }
        );
    };

    isUseCaseSelected = (useCaseId: string) => {
        return this.state.role.useCaseIds.some((r) => r === useCaseId);
    };

    toggleUseCaseChange = (useCaseId: string) => {
        let useCaseIds = [...this.state.role.useCaseIds];

        if (this.isUseCaseSelected(useCaseId))
            useCaseIds = this.state.role.useCaseIds.filter((r) => r !== useCaseId);
        else useCaseIds.push(useCaseId);

        this.handleChange("useCaseIds", useCaseIds);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    getApplicationName = (applicationId: string) => {
        const application = this.props.applications.find((a) => a.id === applicationId);
        if (application) return application.name;
        return "";
    };

    isInsert = () => {
        return !!this.state.role.id;
    };

    getTabTitle = (title: string, prefix: string) => {
        const count = getValidationSubSet(prefix, this.props.validationResults).length;
        return (
            <Badge count={count} offset={[10, -2]}>
                {title}
            </Badge>
        );
    };

    render() {
        const { role } = this.state;
        const { validationResults } = this.props;

        return (
            <Tabs onChange={this.onTabChange} activeKey={this.state.activeTab} sticky={true}>
                <TabPane tab="Details" key="details_tab">
                    <Form editRole={ROLE_SUPER_ADMIN}>
                        <FormInput
                            fieldName="name"
                            label="Name"
                            value={role.name}
                            onChange={this.handleChange}
                            disabled={this.isInsert()}
                            validationResults={validationResults}
                        />
                        <FormInput
                            fieldName="description"
                            label="Description"
                            value={role.description}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        />
                        <FormSelect
                            fieldName="applicationId"
                            label="Application"
                            value={role.applicationId}
                            onChange={this.handleApplicationChange}
                            validationResults={validationResults}
                            options={this.props.applications}
                            optionsValue="id"
                            optionsText="name"
                        />
                    </Form>
                </TabPane>
                <TabPane tab={this.getTabTitle("Permissions", "useCaseIds")} key="roles_tab">
                    <FormErrors
                        validationResults={getValidationSubSet("useCaseIds", validationResults)}
                    />
                    <List
                        header={
                            <h4 className="mb-0">
                                {this.getApplicationName(role.applicationId)} Permissions
                            </h4>
                        }
                        bordered={true}
                        size="small"
                        dataSource={this.props.useCases.filter(
                            (u) => u.applicationId === role.applicationId
                        )}
                        renderItem={(useCase: UseCase) => (
                            <List.Item
                                actions={[
                                    <Switch
                                        key={useCase.id}
                                        checked={this.isUseCaseSelected(useCase.id)}
                                        size="small"
                                        onChange={() => this.toggleUseCaseChange(useCase.id)}
                                        disabled={!hasRole(ROLE_SUPER_ADMIN, this.props.roles)}
                                    />,
                                ]}
                            >
                                {useCase.name}
                            </List.Item>
                        )}
                        className="mb-2"
                    />
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const roleState = roleSelector(state);

    return {
        roles: roleState,
    };
};

export default connect(mapStateToProps)(RoleForm);
