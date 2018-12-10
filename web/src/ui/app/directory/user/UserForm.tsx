import { List, Switch, Tabs } from 'antd';
import React, { Component } from 'react';

import { Application } from '@/state/app/directory/applications/types';
import { Organisation } from '@/state/app/directory/organisations/types';
import { Role } from '@/state/app/directory/roles/types';
import { UserEdit } from '@/state/app/directory/users/types';
import { ValidationResult } from '@/state/types';
import { Form, FormInput, FormSelect } from '@/ui/controls';

const TabPane = Tabs.TabPane;

type Props = {
    user: UserEdit;
    organisations: Organisation[];
    applications: Application[];
    roles: Role[];
    validationResults: ValidationResult[];
    onChange: (user: UserEdit) => void;
};

type State = {
    user: UserEdit;
};

class UserForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: props.user
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.user != prevProps.user)
            this.setState({
                user: this.props.user
            });
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

        if(this.isRoleSelected(roleId))
            roleIds = this.state.user.roleIds.filter(r => r !== roleId);
        else
            roleIds.push(roleId);

        this.handleChange("roleIds", roleIds);
    };

    render() {
        const { validationResults } = this.props;
        const { user } = this.state;

        if (!user) return <div />;

        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="Details" key="1">
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
                        <FormSelect
                            fieldName="organisationId"
                            label="Organisation"
                            value={user.organisationId}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            options={this.props.organisations}
                            optionsValue="id"
                            optionsText="name"
                        />
                    </Form>
                </TabPane>
                <TabPane tab="Roles" key="2">
                    {this.props.applications.map(application => (
                        <List
                            key={application.id}
                            header={<h4 className="mb-0">{application.name}</h4>}
                            bordered
                            dataSource={this.props.roles.filter(r => r.applicationId === application.id)}
                            renderItem={(role: Role) => <List.Item actions={[<Switch checked={this.isRoleSelected(role.id)} onChange={() => this.toggleRoleChange(role.id)} size="small" />]}>{role.name}</List.Item>}
                            className="mb-2"
                        />
                    ))}
                </TabPane>
            </Tabs>
        );
    }
}

export default UserForm;
