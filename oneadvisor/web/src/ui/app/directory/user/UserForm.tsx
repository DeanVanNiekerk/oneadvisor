import { Badge, List, Switch } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { getValidationSubSet, ValidationResult } from "@/app/validation";
import { getScopes } from "@/config/scope";
import { Application } from "@/state/app/directory/applications";
import { UserType, userTypesSelector } from "@/state/app/directory/lookups";
import { Organisation } from "@/state/app/directory/organisations";
import { Role } from "@/state/app/directory/roles";
import { UserEdit } from "@/state/app/directory/users";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Form, FormErrors, FormInput, FormSelect, FormSimpleList, FormSwitch, TabPane, Tabs } from "@/ui/controls";

import SplitRuleList from "../../commission/splitRule/SplitRuleList";
import BranchSelect from "./BranchSelect";
import Emails from "./Emails";

type TabKey = "details_tab" | "roles_tab" | "aliases_tab" | "emails_tab" | "commission_tab";

type Props = {
    user: UserEdit;
    organisations: Organisation[];
    applications: Application[];
    roles: Role[];
    userTypes: UserType[];
    validationResults: ValidationResult[];
    onChange: (user: UserEdit) => void;
    useCases: string[];
} & DispatchProp;

type State = {
    user: UserEdit;
    activeTab: TabKey;
};

class UserForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: props.user,
            activeTab: "details_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.user != prevProps.user) {
            this.setState({
                user: this.props.user,
                activeTab: "details_tab", //Reset the tab
            });
        }
    }

    handleChange = (fieldName: keyof UserEdit, value: string | number | string[] | boolean) => {
        const user = update(this.state.user, { [fieldName]: { $set: value } });
        this.setState({
            user: user,
        });
        this.props.onChange(user);
    };

    isRoleSelected = (roleName: string) => {
        return this.state.user.roles.some(r => r === roleName);
    };

    toggleRoleChange = (roleName: string) => {
        let roles = [...this.state.user.roles];

        if (this.isRoleSelected(roleName)) roles = this.state.user.roles.filter(r => r !== roleName);
        else roles.push(roleName);

        this.handleChange("roles", roles);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    getRolesTabTitle = () => {
        return this.getTabTitle("Roles", "Roles");
    };

    getAliasesTabTitle = () => {
        return this.getTabTitle("Aliases", "Aliases");
    };

    getTabTitle = (title: string, prefix: string) => {
        const count = getValidationSubSet(prefix, this.props.validationResults, true, false).length;
        return (
            <Badge count={count} offset={[10, -2]}>
                {title}
            </Badge>
        );
    };

    render() {
        const { validationResults } = this.props;
        const { user } = this.state;

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Tabs onChange={this.onTabChange} activeKey={this.state.activeTab} sticky={true}>
                    <TabPane tab="Details" key="details_tab">
                        <Form editUseCase="dir_edit_users">
                            <FormInput
                                fieldName="firstName"
                                label="First Name"
                                value={user.firstName}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                                autoFocus={true}
                            />
                            <FormInput
                                fieldName="lastName"
                                label="Last Name"
                                value={user.lastName}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                            />
                            <FormInput
                                fieldName="email"
                                label="Email"
                                value={user.email}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                            />
                            <FormInput
                                fieldName="userName"
                                label="Username"
                                value={user.userName}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                            />
                            <BranchSelect
                                branchId={user.branchId}
                                organisations={this.props.organisations}
                                validationResults={validationResults}
                                onChange={(branchId: string) => this.handleChange("branchId", branchId)}
                            />
                            <FormSelect
                                fieldName="scope"
                                label="Scope"
                                value={user.scope}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                                options={getScopes()}
                                optionsValue="id"
                                optionsText="name"
                            />
                            <FormSelect
                                fieldName="userTypeId"
                                label="Type"
                                value={user.userTypeId}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                                options={this.props.userTypes}
                                optionsValue="id"
                                optionsText="name"
                            />
                            <FormSwitch
                                fieldName="isLocked"
                                label="Locked"
                                value={user.isLocked}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                                className={user.isLocked ? "bg-error" : ""}
                            />
                        </Form>
                    </TabPane>
                    <TabPane tab={this.getRolesTabTitle()} key="roles_tab">
                        <FormErrors
                            validationResults={getValidationSubSet("Roles", this.props.validationResults, true, true)}
                        />
                        {this.props.applications.map(application => (
                            <List
                                key={application.id}
                                header={<h4 className="mb-0">{application.name}</h4>}
                                bordered={true}
                                size="small"
                                dataSource={this.props.roles.filter(r => r.applicationId === application.id)}
                                renderItem={(role: Role) => (
                                    <List.Item
                                        actions={[
                                            <Switch
                                                disabled={!hasUseCase("dir_edit_users", this.props.useCases)}
                                                checked={this.isRoleSelected(role.name)}
                                                onChange={() => this.toggleRoleChange(role.name)}
                                                size="small"
                                            />,
                                        ]}
                                    >
                                        {role.description}
                                    </List.Item>
                                )}
                                className="mb-2"
                            />
                        ))}
                    </TabPane>
                    <TabPane tab={this.getAliasesTabTitle()} key="aliases_tab">
                        <FormErrors
                            validationResults={getValidationSubSet("Aliases", this.props.validationResults, true, true)}
                        />
                        <FormSimpleList
                            editUseCase="dir_edit_users"
                            fieldName="Aliases"
                            displayName="Alias"
                            values={user.aliases}
                            onChange={(aliases: string[]) => this.handleChange("aliases", aliases)}
                            validationResults={validationResults}
                        />
                    </TabPane>
                    {user.id && (
                        <TabPane tab="Email" key="emails_tab">
                            <Emails userId={user.id} />
                        </TabPane>
                    )}
                    {user.id && hasUseCase("com_view_commission_split_rules", this.props.useCases) && (
                        <TabPane tab="Commission" key="commission_tab">
                            <SplitRuleList userId={user.id} />
                        </TabPane>
                    )}
                </Tabs>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
        userTypes: userTypesSelector(state).items,
    };
};

export default connect(mapStateToProps)(UserForm);
