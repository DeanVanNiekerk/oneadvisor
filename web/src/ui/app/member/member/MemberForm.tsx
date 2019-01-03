import { Dropdown, Icon, Menu } from 'antd';
import React, { Component } from 'react';

import { parseIdNumber } from '@/app/parsers/id';
import { ValidationResult } from '@/app/validation';
import { UserSimple } from '@/state/app/directory/usersSimple';
import { MemberEdit } from '@/state/app/member/members';
import { Form, FormDate, FormInput, FormText } from '@/ui/controls';

type Props = {
    member: MemberEdit;
    validationResults: ValidationResult[];
    onChange: (member: MemberEdit) => void;
    user: UserSimple | null;
    enabled: boolean;
};

type State = {
    member: MemberEdit;
};

class MemberForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            member: props.member
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.member != prevProps.member)
            this.setState({
                member: this.props.member
            });
    }

    handleChange = async (fieldName: string, value: any) => {
        const member = {
            ...this.state.member,
            [fieldName]: value
        };

        await this.updateMember(member);

        this.onFieldChanged(fieldName, value);
    };

    updateMember = (member: MemberEdit): Promise<void> => {
        return new Promise(resolve => {
            this.setState(
                {
                    member: member
                },
                resolve
            );
            this.props.onChange(member);
        });
    };

    onFieldChanged = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'firstName':
                this.onFirstNameChanged(value);
                return;
            case 'idNumber':
                this.onIdNumberChanged(value);
                return;
        }
    };

    onFirstNameChanged = (value: string) => {
        //Auto set the initials and preferred name
        const firstNames = value.split(' ');
        const initials = firstNames.reduce((p, c) => {
            return `${p}${c.charAt(0).toUpperCase()}`;
        }, '');

        const member = {
            ...this.state.member,
            initials: initials,
            preferredName: firstNames.length > 0 ? firstNames[0] : ''
        };
        this.updateMember(member);
    };

    onIdNumberChanged = (
        value: string,
        forceDateOfBirthUpdate: boolean = false
    ) => {
        const result = parseIdNumber(value);

        if (result.dateOfBirth) {
            //Only set the date of birth if it is empty
            const member = {
                ...this.state.member,
                dateOfBirth:
                    this.state.member.dateOfBirth && !forceDateOfBirthUpdate
                        ? this.state.member.dateOfBirth
                        : result.dateOfBirth
            };

            this.updateMember(member);
        }
    };

    syncDateOfBirthToIdNumber = () => {
        this.onIdNumberChanged(this.state.member.idNumber, true);
    };

    idNumberInputAddon = () => {
        const menu = (
            <Menu>
                <Menu.Item key="1" onClick={this.syncDateOfBirthToIdNumber}>
                    Sync Date of Birth
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="setting" className="clickable" />
            </Dropdown>
        );
    };

    render() {
        const { validationResults, user, enabled } = this.props;
        const { member } = this.state;

        return (
            <Form>
                <FormText
                    label="Broker"
                    value={user ? `${user.firstName} ${user.lastName}` : ''}
                    loading={!user}
                />
                <FormInput
                    fieldName="firstName"
                    label="First Name"
                    value={member.firstName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!enabled}
                />
                <FormInput
                    fieldName="lastName"
                    label="Last Name"
                    value={member.lastName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!enabled}
                />
                <FormInput
                    fieldName="initials"
                    label="Initials"
                    value={member.initials}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!enabled}
                />
                <FormInput
                    fieldName="maidenName"
                    label="Maiden Name"
                    value={member.maidenName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!enabled}
                />
                <FormInput
                    fieldName="preferredName"
                    label="Preferred Name"
                    value={member.preferredName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!enabled}
                />
                <FormInput
                    fieldName="idNumber"
                    label="ID Number"
                    value={member.idNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    addonAfter={this.idNumberInputAddon()}
                    disabled={!enabled}
                />
                <FormDate
                    fieldName="dateOfBirth"
                    label="Date of Birth"
                    value={member.dateOfBirth}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!enabled}
                />
            </Form>
        );
    }
}

export default MemberForm;
