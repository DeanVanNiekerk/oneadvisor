import { List, Switch } from 'antd';
import React, { Component } from 'react';

import { Application } from '@/state/app/directory/applications/types';
import { RoleEdit } from '@/state/app/directory/roles';
import { Form, FormInput, FormSelect, TabPane, Tabs } from '@/ui/controls';

type TabKey = 'details_tab' | 'usecases_tab';

type Props = {
    role: RoleEdit;
    applications: Application[];
};

type State = {
    role: RoleEdit;
    activeTab: TabKey;
};

class UserForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            role: props.role,
            activeTab: 'details_tab'
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.role != prevProps.role)
            this.setState({
                role: this.props.role,
                activeTab: 'details_tab' //Reset the tab
            });
    }

    // handleChange = (fieldName: string, value: any) => {
    //     const role = {
    //         ...this.state.role,
    //         [fieldName]: value
    //     };
    //     this.setState({
    //         role: role
    //     });
    //     this.props.onChange(role);
    // };

    isUseCaseSelected = (useCaseId: string) => {
        return this.state.role.useCaseIds.some(r => r === useCaseId);
    };

    // toggleUseCaseChange = (useCaseId: string) => {
    //     let useCaseIds = [...this.state.role.useCaseIds];

    //     if(this.isUseCaseSelected(useCaseId))
    //         useCaseIds = this.state.role.useCaseIds.filter(r => r !== useCaseId);
    //     else
    //         useCaseIds.push(useCaseId);

    //     this.handleChange("useCaseIds", useCaseIds);
    // };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { role } = this.state;

        return (
            <Tabs
                onChange={this.onTabChange}
                activeKey={this.state.activeTab}
                sticky={true}
            >
                <TabPane tab="Details" key="details_tab">
                    <Form>
                        <FormInput
                            fieldName="name"
                            label="Name"
                            value={role.name}
                        />
                        <FormSelect
                            fieldName="applicationId"
                            label="Application"
                            value={role.applicationId}
                            options={this.props.applications}
                            optionsValue="id"
                            optionsText="name"
                        />
                    </Form>
                </TabPane>
                <TabPane tab="Use Cases" key="roles_tab">
                    <List
                        bordered={true}
                        size="small"
                        dataSource={role.useCaseIds}
                        renderItem={(useCaseId: string) => (
                            <List.Item
                                actions={[
                                    <Switch
                                        checked={this.isUseCaseSelected(
                                            useCaseId
                                        )}
                                        size="small"
                                    />
                                ]}
                            >
                                {useCaseId}
                            </List.Item>
                        )}
                        className="mb-2"
                    />
                </TabPane>
            </Tabs>
        );
    }
}

export default UserForm;
