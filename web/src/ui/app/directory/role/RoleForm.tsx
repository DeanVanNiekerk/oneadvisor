import { List, Switch } from 'antd';
import React, { Component } from 'react';

import { Application } from '@/state/app/directory/applications/types';
import { RoleEdit } from '@/state/app/directory/roles';
import { UseCase } from '@/state/app/directory/usecases';
import { Form, FormText, TabPane, Tabs } from '@/ui/controls';

type TabKey = 'details_tab' | 'usecases_tab';

type Props = {
    role: RoleEdit;
    applications: Application[];
    useCases: UseCase[];
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

    getApplicationName = (applicationId: string) => {
        const application = this.props.applications.find(
            a => a.id === applicationId
        );
        if (application) return application.name;
        return '';
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
                        <FormText label="Name" value={role.name} />
                        <FormText
                            label="Description"
                            value={role.description}
                        />
                        <FormText
                            label="Application"
                            value={this.getApplicationName(role.applicationId)}
                        />
                    </Form>
                </TabPane>
                <TabPane tab="Use Cases" key="roles_tab">
                    <List
                        header={
                            <h4 className="mb-0">
                                {this.getApplicationName(role.applicationId)}{' '}
                                Use Cases
                            </h4>
                        }
                        bordered={true}
                        size="small"
                        dataSource={this.props.useCases.filter(
                            u => u.applicationId === role.applicationId
                        )}
                        renderItem={(useCase: UseCase) => (
                            <List.Item
                                actions={[
                                    <Switch
                                        checked={this.isUseCaseSelected(
                                            useCase.id
                                        )}
                                        size="small"
                                    />
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

export default UserForm;
