import { Dropdown, Icon, Menu } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { parseIdNumber } from '@/app/parsers/id';
import { ValidationResult } from '@/app/validation';
import {
    ClientEdit, getAlternateIdNumberLabel, getDateOfBirthLabel, getLastNameLabel
} from '@/state/app/client/clients';
import {
    ClientType, ClientTypeId, clientTypesSelector, MarritalStatus, marritalStatusSelector
} from '@/state/app/client/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormDate, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    client: ClientEdit;
    validationResults: ValidationResult[];
    onChange: (client: ClientEdit) => void;
    marritalStatus: MarritalStatus[];
    clientTypes: ClientType[];
};

type State = {
    client: ClientEdit;
};

class ClientForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            client: props.client,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.client != prevProps.client)
            this.setState({
                client: this.props.client,
            });
    }

    handleChange = async (fieldName: string, value: any) => {
        const client = {
            ...this.state.client,
            [fieldName]: value,
        };

        await this.updateClient(client);

        this.onFieldChanged(fieldName, value);
    };

    updateClient = (client: ClientEdit): Promise<void> => {
        return new Promise(resolve => {
            this.setState(
                {
                    client: client,
                },
                resolve
            );
            this.props.onChange(client);
        });
    };

    onFieldChanged = (fieldName: string, value: string) => {
        switch (fieldName) {
            case "firstName":
                this.onFirstNameChanged(value);
                return;
            case "idNumber":
                this.onIdNumberChanged(value);
                return;
        }
    };

    onFirstNameChanged = (value: string) => {
        //Auto set the initials and preferred name
        const firstNames = value.split(" ");
        const initials = firstNames.reduce((p, c) => {
            return `${p}${c.charAt(0).toUpperCase()}`;
        }, "");

        const client = {
            ...this.state.client,
            initials: initials,
            preferredName: firstNames.length > 0 ? firstNames[0] : "",
        };
        this.updateClient(client);
    };

    onIdNumberChanged = (
        value: string,
        forceDateOfBirthUpdate: boolean = false
    ) => {
        const result = parseIdNumber(value);

        if (result.dateOfBirth) {
            //Only set the date of birth if it is empty
            const client = {
                ...this.state.client,
                dateOfBirth:
                    this.state.client.dateOfBirth && !forceDateOfBirthUpdate
                        ? this.state.client.dateOfBirth
                        : result.dateOfBirth,
            };

            this.updateClient(client);
        }
    };

    syncDateOfBirthToIdNumber = () => {
        this.onIdNumberChanged(this.state.client.idNumber, true);
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
            <Dropdown overlay={menu} trigger={["click"]}>
                <Icon type="setting" className="clickable" />
            </Dropdown>
        );
    };

    isMarried = () => {
        const marriedStatus = [
            "5f7a5d69-845c-4f8d-b108-7c70084f3f6a", //Married COP
            "b31331ec-73cb-4985-aa93-e60e04a48095", //Married ANC
            "b16cbd3b-cf50-4a74-8f38-a8ca6b1cb83f", //Married ANC (with Accrual)
        ];

        return marriedStatus.some(
            id => this.state.client.marritalStatusId === id
        );
    };

    render() {
        const { validationResults } = this.props;
        const { client } = this.state;

        return (
            <Form editUseCase="clt_edit_clients">
                <FormSelect
                    fieldName="clientTypeId"
                    label="Client Type"
                    value={client.clientTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.clientTypes}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormInput
                    fieldName="firstName"
                    label="First Name"
                    value={client.firstName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                    hidden={client.clientTypeId != ClientTypeId.Individual}
                />
                <FormInput
                    fieldName="lastName"
                    label={getLastNameLabel(client.clientTypeId)}
                    value={client.lastName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="initials"
                    label="Initials"
                    value={client.initials}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    hidden={client.clientTypeId !== ClientTypeId.Individual}
                />
                <FormInput
                    fieldName="maidenName"
                    label="Maiden Name"
                    value={client.maidenName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    hidden={client.clientTypeId !== ClientTypeId.Individual}
                />
                <FormInput
                    fieldName="preferredName"
                    label="Preferred Name"
                    value={client.preferredName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    hidden={client.clientTypeId !== ClientTypeId.Individual}
                />
                <FormInput
                    fieldName="idNumber"
                    label="ID Number"
                    value={client.idNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    addonAfter={this.idNumberInputAddon()}
                    hidden={client.clientTypeId !== ClientTypeId.Individual}
                />
                <FormInput
                    fieldName="alternateIdNumber"
                    label={getAlternateIdNumberLabel(client.clientTypeId)}
                    value={client.alternateIdNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormDate
                    fieldName="dateOfBirth"
                    label={getDateOfBirthLabel(client.clientTypeId)}
                    value={client.dateOfBirth}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="taxNumber"
                    label="Tax Number"
                    value={client.taxNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormSelect
                    fieldName="marritalStatusId"
                    label="Marrital Status"
                    value={client.marritalStatusId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.marritalStatus}
                    optionsValue="id"
                    optionsText="name"
                    hidden={client.clientTypeId !== ClientTypeId.Individual}
                />
                <FormDate
                    fieldName="marriageDate"
                    label="Marriage Date"
                    value={client.marriageDate}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    hidden={
                        client.clientTypeId !== ClientTypeId.Individual ||
                        !this.isMarried()
                    }
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const marritalStatusState = marritalStatusSelector(state);
    const clientTypesState = clientTypesSelector(state);

    return {
        marritalStatus: marritalStatusState.items,
        clientTypes: clientTypesState.items,
    };
};

export default connect(mapStateToProps)(ClientForm);
