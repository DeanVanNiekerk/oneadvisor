import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { filterOption } from "@/app/controls/select";
import { RootState } from "@/state";
import { fetchClients } from "@/state/client/clients";
import {
    modifyPolicy,
    PolicyEdit,
    policyProductCascaseSelector,
    policyProductCascaseValuesSelector,
    policySelector,
} from "@/state/client/policies";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { brokersSelector } from "@/state/lookups/directory/usersSimple";
import ClientSearch from "@/ui/app/client/client/list/ClientSearch";
import {
    Button,
    ClientName,
    Drawer,
    Form,
    FormCascade,
    FormDate,
    FormInput,
    FormInputNumber,
    FormSelect,
    FormSwitch,
    FormText,
} from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const PolicyDetails: React.FC<Props> = (props: Props) => {
    const { policy, handleChange, validationResults } = props;

    if (!policy) return <React.Fragment />;

    const [clientSearchVisible, setClientSearchVisible] = useState<boolean>(false);

    const onChange = (
        fieldName: keyof PolicyEdit,
        value: string | boolean | number | undefined | null
    ) => {
        handleChange(policy, fieldName, value);
    };

    return (
        <>
            <Form editUseCase="clt_edit_policies">
                <FormText
                    fieldName="clientId"
                    label="Client"
                    value={policy.clientId ? <ClientName clientId={policy.clientId} /> : null}
                    emptyValueText={<span className="text-error">Select Client</span>}
                    validationResults={validationResults}
                    extra={
                        <>
                            <Button
                                size="small"
                                iconName="search"
                                type={policy.clientId ? "dashed" : "primary"}
                                onClick={() => setClientSearchVisible(true)}
                            >
                                {policy.clientId ? "Change Client" : "Select Client"}
                            </Button>
                        </>
                    }
                />
                <FormSelect<string>
                    fieldName="companyId"
                    label="Company"
                    value={policy.companyId || ""}
                    onChange={onChange}
                    validationResults={validationResults}
                    options={props.companies}
                    optionsValue="id"
                    optionsText="name"
                    filterOption={filterOption}
                />
                <FormCascade
                    fieldName="policyTypeId"
                    label="Type / Product / Name"
                    value={props.policyProductCascaseValues}
                    onChange={(values: string[]) =>
                        props.handlePolicyProductCascaseChange(policy, values)
                    }
                    validationResults={validationResults}
                    options={props.policyProductCascase}
                    changeOnSelect={true}
                />
                <FormSelect<string>
                    fieldName="userId"
                    label="Broker"
                    value={policy.userId || ""}
                    onChange={onChange}
                    validationResults={validationResults}
                    options={props.users}
                    optionsValue="id"
                    optionsText="fullName"
                    filterOption={filterOption}
                />
                <FormInput
                    fieldName="number"
                    label="Number"
                    value={policy.number}
                    onChange={onChange}
                    validationResults={validationResults}
                />
                <FormInputNumber
                    fieldName="premium"
                    label="Premium"
                    value={policy.premium === null ? undefined : policy.premium}
                    onChange={onChange}
                    validationResults={validationResults}
                    min={0}
                />
                <FormDate
                    fieldName="startDate"
                    label="Start Date"
                    value={policy.startDate}
                    onChange={onChange}
                    validationResults={validationResults}
                />
                <FormSwitch
                    fieldName="isActive"
                    label="Active"
                    value={policy.isActive}
                    onChange={onChange}
                    validationResults={validationResults}
                />
            </Form>

            <Drawer
                title="Client Search"
                visible={clientSearchVisible}
                onClose={() => setClientSearchVisible(false)}
                footer={<Button onClick={() => setClientSearchVisible(false)}>Close</Button>}
            >
                <ClientSearch
                    defaultSearchText={""}
                    onSelect={(clientId: string) => {
                        onChange("clientId", clientId);
                        setClientSearchVisible(false);
                    }}
                />
            </Drawer>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyState = policySelector(state);
    return {
        policy: policyState.policy,
        validationResults: policyState.validationResults,
        companies: organisationCompaniesSelector(state),
        users: brokersSelector(state),
        policyProductCascase: policyProductCascaseSelector(state),
        policyProductCascaseValues: policyProductCascaseValuesSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        fetchClients: () => {
            dispatch(fetchClients(true));
        },
        handleChange: (
            policy: PolicyEdit,
            fieldName: keyof PolicyEdit,
            value: string | boolean | number | undefined | null
        ) => {
            const policyModified = update(policy, { [fieldName]: { $set: value } });

            //If the company changes we need to clear the PolicyProduct
            if (fieldName === "companyId") policy.policyProductId = null;

            dispatch(modifyPolicy(policyModified));
        },
        handlePolicyProductCascaseChange: (policy: PolicyEdit, values: string[]) => {
            const policyModified: PolicyEdit = {
                ...policy,
                policyTypeId: null,
                policyProductTypeId: null,
                policyProductId: null,
            };

            if (values.length >= 1) policyModified.policyTypeId = values[0];

            if (values.length >= 2) policyModified.policyProductTypeId = values[1];

            if (values.length === 3) policyModified.policyProductId = values[2];

            dispatch(modifyPolicy(policyModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyDetails);
