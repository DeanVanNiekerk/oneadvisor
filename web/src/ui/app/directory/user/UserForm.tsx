import { List, Switch } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { getScopes } from '@/config/scope';
import { Application } from '@/state/app/directory/applications';
import { branchesSelector, branchSelector } from '@/state/app/directory/branches';
import { Organisation } from '@/state/app/directory/organisations';
import { Role } from '@/state/app/directory/roles';
import { UserEdit } from '@/state/app/directory/users';
import { RootState } from '@/state/rootReducer';
import { Form, FormErrors, FormInput, FormSelect, TabPane, Tabs } from '@/ui/controls';

import BranchSelect from './BranchSelect';

type TabKey = 'details_tab' | 'roles_tab';

type Props = {
    user: UserEdit;
    organisations: Organisation[];
    applications: Application[];
    roles: Role[];
    validationResults: ValidationResult[];
    onChange: (user: UserEdit) => void;
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
            activeTab: 'details_tab'
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.user != prevProps.user) {
            this.setState({
                user: this.props.user,
                activeTab: 'details_tab' //Reset the tab
            });
        }
    }

    handleChange = (fieldName: string, value: any) => {
        const user = {
            ...this.state.user,
            [fieldName]: value
        };
        this.setState({
            user: user
        });
        this.props.onChange(user);
    };

    isRoleSelected = (roleId: string) => {
        return this.state.user.roleIds.some(r => r === roleId);
    };

    toggleRoleChange = (roleId: string) => {
        let roleIds = [...this.state.user.roleIds];

        if (this.isRoleSelected(roleId))
            roleIds = this.state.user.roleIds.filter(r => r !== roleId);
        else roleIds.push(roleId);

        this.handleChange('roleIds', roleIds);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { validationResults } = this.props;
        const { user } = this.state;

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Tabs
                    onChange={this.onTabChange}
                    activeKey={this.state.activeTab}
                    sticky={true}
                >
                    <TabPane tab="Details" key="details_tab">
                        <Form>
                            <FormInput
                                fieldName="firstName"
                                label="First Name"
                                value={user.firstName}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                            />
                            <FormInput
                                fieldName="lastName"
                                label="Last Name"
                                value={user.lastName}
                                onChange={this.handleChange}
                                validationResults={validationResults}
                            />
                            <FormInput
                                fieldName="login"
                                label="Login"
                                value={user.login}
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
                            <BranchSelect
                                branchId={user.branchId}
                                organisations={this.props.organisations}
                                validationResults={validationResults}
                                onChange={(branchId: string) =>
                                    this.handleChange('branchId', branchId)
                                }
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
                            {/* <FormInput
                            fieldName="assistantToUserId"
                            label="Assistant To"
                            value={user.assistantToUserId}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        /> */}
                        </Form>
                    </TabPane>
                    <TabPane tab="Roles" key="roles_tab">
                        {this.props.applications.map(application => (
                            <List
                                key={application.id}
                                header={
                                    <h4 className="mb-0">{application.name}</h4>
                                }
                                bordered={true}
                                size="small"
                                dataSource={this.props.roles.filter(
                                    r => r.applicationId === application.id
                                )}
                                renderItem={(role: Role) => (
                                    <List.Item
                                        actions={[
                                            <Switch
                                                checked={this.isRoleSelected(
                                                    role.id
                                                )}
                                                onChange={() =>
                                                    this.toggleRoleChange(
                                                        role.id
                                                    )
                                                }
                                                size="small"
                                            />
                                        ]}
                                    >
                                        {role.name}
                                    </List.Item>
                                )}
                                className="mb-2"
                            />
                        ))}
                    </TabPane>
                </Tabs>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const branchState = branchSelector(state);
    const branchesState = branchesSelector(state);

    return {
        branch: branchState.branch,
        branches: branchesState.items
    };
};

export default connect(mapStateToProps)(UserForm);
