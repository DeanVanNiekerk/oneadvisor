import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import { clientVisible, newClient } from "@/state/client/clients";
import { ClientEdit } from "@/state/client/clients/types";
import { newPolicy, policyVisible } from "@/state/client/policies";
import { PolicyEdit } from "@/state/client/policies/types";
import {
    CommissionErrorEdit,
    mappingErrorSelector,
    modifyMappingError,
} from "@/state/commission/errors";
import { Statement } from "@/state/commission/statements";
import EditClient from "@/ui/app/client/client/form/EditClient";
import EditPolicy from "@/ui/app/client/policy/form/EditPolicy";
import PolicySearch from "@/ui/app/client/policy/list/PolicySearch";
import {
    Button,
    ClientName,
    ClientSearch,
    CommissionTypeName,
    Drawer,
    Form,
    FormText,
    PolicyName,
} from "@/ui/controls";

type Props = {
    statement: Statement;
} & PropsFromState &
    PropsFromDispatch;

const MappingDetails: React.FC<Props> = (props: Props) => {
    if (!props.error) return <React.Fragment />;

    const { error, validationResults, handleChange } = props;

    const [clientSearchVisible, setClientSearchVisible] = useState<boolean>(false);
    const [policySearchVisible, setPolicySearchVisible] = useState<boolean>(false);

    const newClient = () => {
        const { data } = error;
        props.newClient({
            firstName: data.firstName || "",
            lastName: data.lastName || data.fullName || "",
            dateOfBirth: data.dateOfBirth || null,
            idNumber: data.idNumber || "",
            initials: data.initials || "",
        });
    };

    const newPolicy = () => {
        if (!error.clientId) return;

        const policy: Partial<PolicyEdit> = {
            clientId: error.clientId,
            companyId: props.statement.companyId,
            number: error.data.policyNumber,
        };
        props.newPolicy(policy);
    };

    const onChange = (fieldName: keyof CommissionErrorEdit, value: string | null) => {
        handleChange(error, fieldName, value);
    };

    const clientSaved = (client: ClientEdit) => {
        setClientId(client.id);
    };

    const policySaved = (policy: PolicyEdit) => {
        setPolicyId(policy.id);
    };

    const setClientId = (clientId: string | null) => {
        //If the client changes clear the policy
        if (clientId != error.clientId) setPolicyId(null);

        onChange("clientId", clientId);
    };

    const setPolicyId = (policyId: string | null) => {
        onChange("policyId", policyId);
    };

    return (
        <>
            <Form editUseCase="com_edit_commission_statements">
                <FormText
                    fieldName="clientId"
                    label="Client"
                    value={
                        error.clientId ? (
                            <ClientName clientId={error.clientId} className="text-success" />
                        ) : null
                    }
                    emptyValueText={<span className="text-error">No Mapped Client</span>}
                    validationResults={validationResults}
                    extra={
                        <>
                            <Button
                                size="small"
                                iconName="search"
                                type={error.clientId ? "dashed" : "primary"}
                                onClick={() => setClientSearchVisible(true)}
                            >
                                {error.clientId ? "Change Client" : "Select Client"}
                            </Button>
                            <Button
                                size="small"
                                iconName="plus"
                                type={error.clientId ? "dashed" : "primary"}
                                onClick={newClient}
                            >
                                New Client
                            </Button>
                        </>
                    }
                />
                <FormText
                    fieldName="policyId"
                    label="Policy"
                    value={
                        error.policyId ? (
                            <PolicyName policyId={error.policyId} className="text-success" />
                        ) : null
                    }
                    emptyValueText={<span className="text-error">No Mapped Policy</span>}
                    validationResults={validationResults}
                    extra={
                        <>
                            <Button
                                size="small"
                                iconName="search"
                                type={error.policyId ? "dashed" : "primary"}
                                onClick={() => setPolicySearchVisible(true)}
                                disabled={!error.clientId}
                            >
                                Find Policy
                            </Button>
                            <Button
                                size="small"
                                iconName="plus"
                                type={error.policyId ? "dashed" : "primary"}
                                onClick={newPolicy}
                                disabled={!error.clientId}
                            >
                                New Policy
                            </Button>
                        </>
                    }
                />
                <FormText
                    fieldName="commissionTypeId"
                    label="Commission Type"
                    value={
                        error.commissionTypeId ? (
                            <CommissionTypeName commissionTypeId={error.commissionTypeId} />
                        ) : null
                    }
                    emptyValueText={<span className="text-error">No Mapped Commission Type</span>}
                    validationResults={validationResults}
                />
            </Form>

            <EditClient onSaved={clientSaved} />
            <EditPolicy onSaved={policySaved} />

            <Drawer
                title="Client Search"
                visible={clientSearchVisible}
                onClose={() => setClientSearchVisible(false)}
                footer={<Button onClick={() => setClientSearchVisible(false)}>Close</Button>}
            >
                <ClientSearch
                    defaultSearchText={error.data.lastName || ""}
                    onSelect={(clientId: string) => {
                        setClientId(clientId);
                        setClientSearchVisible(false);
                    }}
                />
            </Drawer>

            <Drawer
                title="Policy Search"
                visible={policySearchVisible}
                onClose={() => setPolicySearchVisible(false)}
                footer={<Button onClick={() => setPolicySearchVisible(false)}>Close</Button>}
            >
                <PolicySearch
                    onSelect={(policyId: string) => {
                        setPolicyId(policyId);
                        setPolicySearchVisible(false);
                    }}
                    clientId={error.clientId}
                    companyId={props.statement.companyId}
                />
            </Drawer>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const mappingErrorState = mappingErrorSelector(state);
    return {
        error: mappingErrorState.commissionError,
        validationResults: mappingErrorState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        newClient: (client: Partial<ClientEdit>) => {
            dispatch(newClient(client));
            dispatch(clientVisible(true));
        },
        newPolicy: (policy: Partial<PolicyEdit>) => {
            dispatch(newPolicy(policy));
            dispatch(policyVisible(true));
        },
        handleChange: (
            error: CommissionErrorEdit,
            fieldName: keyof CommissionErrorEdit,
            value: string | null
        ) => {
            const errorModified = update(error, { [fieldName]: { $set: value } });
            dispatch(modifyMappingError(errorModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MappingDetails);
