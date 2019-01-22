import { Dropdown, Icon, Menu } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { parseIdNumber } from '@/app/parsers/id';
import { ValidationResult } from '@/app/validation';
import { MarritalStatus, marritalStatusSelector } from '@/state/app/directory/lookups/marritalStatus';
import { MemberEdit } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Form, FormDate, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    member: MemberEdit;
    validationResults: ValidationResult[];
    onChange: (member: MemberEdit) => void;
    marritalStatus: MarritalStatus[];
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

    isMarried = () => {
        const marriedStatus = [
            '5f7a5d69-845c-4f8d-b108-7c70084f3f6a', //Married COP
            'b31331ec-73cb-4985-aa93-e60e04a48095', //Married ANC
            'b16cbd3b-cf50-4a74-8f38-a8ca6b1cb83f' //Married ANC (with Accrual)
        ];

        return marriedStatus.some(
            id => this.state.member.marritalStatusId === id
        );
    };

    render() {
        const { validationResults } = this.props;
        const { member } = this.state;

        return (
            <Form editUseCase="mem_edit_members">
                <FormInput
                    fieldName="firstName"
                    label="First Name"
                    value={member.firstName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormInput
                    fieldName="lastName"
                    label="Last Name"
                    value={member.lastName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="initials"
                    label="Initials"
                    value={member.initials}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="maidenName"
                    label="Maiden Name"
                    value={member.maidenName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="preferredName"
                    label="Preferred Name"
                    value={member.preferredName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="idNumber"
                    label="ID Number"
                    value={member.idNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    addonAfter={this.idNumberInputAddon()}
                />
                <FormInput
                    fieldName="passportNumber"
                    label="Passport Number"
                    value={member.passportNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormDate
                    fieldName="dateOfBirth"
                    label="Date of Birth"
                    value={member.dateOfBirth}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="taxNumber"
                    label="Tax Number"
                    value={member.taxNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormSelect
                    fieldName="marritalStatusId"
                    label="Marrital Status"
                    value={member.marritalStatusId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.marritalStatus}
                    optionsValue="id"
                    optionsText="name"
                />
                {this.isMarried() && (
                    <FormDate
                        fieldName="marriageDate"
                        label="Marriage Date"
                        value={member.marriageDate}
                        onChange={this.handleChange}
                        validationResults={validationResults}
                    />
                )}
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const marritalStatusState = marritalStatusSelector(state);

    return {
        marritalStatus: marritalStatusState.items
    };
};

export default connect(mapStateToProps)(MemberForm);
