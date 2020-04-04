import { Dropdown, Menu } from "antd";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { parseIdNumber } from "@/app/parsers/id";
import { RootState } from "@/state";
import {
    ClientEdit,
    clientIsMarried,
    clientSelector,
    getAlternateIdNumberLabel,
    getDateOfBirthLabel,
    getLastNameLabel,
    modifyClient,
} from "@/state/client/clients";
import { ClientTypeId, clientTypesSelector, marritalStatusSelector } from "@/state/client/lookups";
import { Form, FormDate, FormInput, FormSelect } from "@/ui/controls";
import { SettingOutlined } from "@ant-design/icons";

type Props = PropsFromState & PropsFromDispatch;

const ClientForm: React.FC<Props> = (props: Props) => {
    const { client } = props;

    if (!client) return <React.Fragment />;

    const idNumberInputAddon = () => {
        const menu = (
            <Menu>
                <Menu.Item key="1" onClick={() => props.syncDateOfBirthToIdNumber(client)}>
                    Sync Date of Birth
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} trigger={["click"]}>
                <SettingOutlined className="clickable" />
            </Dropdown>
        );
    };

    const onChange = (fieldName: keyof ClientEdit, value: string) => {
        props.handleChange(client, fieldName, value);
    };

    return (
        <Form editUseCase="clt_edit_clients">
            <FormSelect
                fieldName="clientTypeId"
                label="Client Type"
                value={client.clientTypeId}
                onChange={onChange}
                validationResults={props.validationResults}
                options={props.clientTypes}
                optionsValue="id"
                optionsText="name"
            />
            <FormInput
                fieldName="firstName"
                label="First Name"
                value={client.firstName}
                onChange={onChange}
                validationResults={props.validationResults}
                autoFocus={true}
                hidden={client.clientTypeId != ClientTypeId.Individual}
            />
            <FormInput
                fieldName="lastName"
                label={getLastNameLabel(client.clientTypeId)}
                value={client.lastName}
                onChange={onChange}
                validationResults={props.validationResults}
            />
            <FormInput
                fieldName="initials"
                label="Initials"
                value={client.initials}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId !== ClientTypeId.Individual}
            />
            <FormInput
                fieldName="maidenName"
                label="Maiden Name"
                value={client.maidenName}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId !== ClientTypeId.Individual}
            />
            <FormInput
                fieldName="preferredName"
                label="Preferred Name"
                value={client.preferredName}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId !== ClientTypeId.Individual}
            />
            <FormInput
                fieldName="idNumber"
                label="ID Number"
                value={client.idNumber}
                onChange={onChange}
                validationResults={props.validationResults}
                addonAfter={idNumberInputAddon()}
                hidden={client.clientTypeId !== ClientTypeId.Individual}
            />
            <FormInput
                fieldName="alternateIdNumber"
                label={getAlternateIdNumberLabel(client.clientTypeId)}
                value={client.alternateIdNumber}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId === ClientTypeId.UnknownEntity}
            />
            <FormDate
                fieldName="dateOfBirth"
                label={getDateOfBirthLabel(client.clientTypeId)}
                value={client.dateOfBirth}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId === ClientTypeId.UnknownEntity}
            />
            <FormInput
                fieldName="taxNumber"
                label="Tax Number"
                value={client.taxNumber}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId === ClientTypeId.UnknownEntity}
            />
            <FormSelect
                fieldName="marritalStatusId"
                label="Marrital Status"
                value={client.marritalStatusId || ""}
                onChange={onChange}
                validationResults={props.validationResults}
                options={props.marritalStatus}
                optionsValue="id"
                optionsText="name"
                hidden={client.clientTypeId !== ClientTypeId.Individual}
            />
            <FormDate
                fieldName="marriageDate"
                label="Marriage Date"
                value={client.marriageDate}
                onChange={onChange}
                validationResults={props.validationResults}
                hidden={client.clientTypeId !== ClientTypeId.Individual || !props.isMarried}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const clientState = clientSelector(state);
    return {
        client: clientState.client,
        validationResults: clientState.validationResults,
        marritalStatus: marritalStatusSelector(state).items,
        clientTypes: clientTypesSelector(state).items,
        isMarried: clientIsMarried(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (client: ClientEdit, fieldName: keyof ClientEdit, value: string) => {
            let clientModified = update(client, { [fieldName]: { $set: value } });

            if (fieldName === "idNumber")
                clientModified = idNumberChanged(clientModified, value, false);

            if (fieldName === "firstName") clientModified = firstNameChanged(clientModified, value);

            dispatch(modifyClient(clientModified));
        },
        syncDateOfBirthToIdNumber: (client: ClientEdit) => {
            const clientModified = idNumberChanged(client, client.idNumber, true);
            dispatch(modifyClient(clientModified));
        },
    };
};

const idNumberChanged = (
    client: ClientEdit,
    value: string,
    forceDateOfBirthUpdate = false
): ClientEdit => {
    const result = parseIdNumber(value);

    if (result.dateOfBirth) {
        //Only set the date of birth if it is empty
        const clientModified = {
            ...client,
            dateOfBirth:
                client.dateOfBirth && !forceDateOfBirthUpdate
                    ? client.dateOfBirth
                    : result.dateOfBirth,
        };

        return clientModified;
    }

    return client;
};

const firstNameChanged = (client: ClientEdit, value: string): ClientEdit => {
    //Auto set the initials and preferred name
    const firstNames = value.split(" ");
    const initials = firstNames.reduce((p, c) => {
        return `${p}${c.charAt(0).toUpperCase()}`;
    }, "");

    return {
        ...client,
        initials: initials,
        preferredName: firstNames.length > 0 ? firstNames[0] : "",
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientForm);
