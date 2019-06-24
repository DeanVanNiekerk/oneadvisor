import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { ClientEdit, newClient, receiveClient } from '@/state/app/client/clients';
import { newPolicy, PolicyEdit, receivePolicy } from '@/state/app/client/policies';
import { CommissionErrorEdit, CommissionImportData } from '@/state/app/commission/errors';
import { Statement } from '@/state/app/commission/statements';
import ClientSearch from '@/ui/app/client/client/ClientSearch';
import EditClient from '@/ui/app/client/client/EditClient';
import EditPolicy from '@/ui/app/client/policy/EditPolicy';
import PolicySearch from '@/ui/app/client/policy/PolicySearch';
import {
    Button, ClientName, CommissionTypeName, Drawer, DrawerFooter, Form, FormReadOnly, FormText, PolicyName, TabPane,
    Tabs
} from '@/ui/controls';
import update from 'immutability-helper';

type Props = {
    statement: Statement;
    error: CommissionErrorEdit;
    validationResults: ValidationResult[];
    onChange: (error: CommissionErrorEdit) => void;
} & DispatchProp;

type State = {
    error: CommissionErrorEdit;
    errorData: CommissionImportData;
    searchClientVisible: boolean;
    searchPolicyVisible: boolean;
    clientEditVisible: boolean;
    activeTab: TabKey;
};

type TabKey = "form_tab" | "data_tab";

class MappingErrorForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: props.error,
            errorData: props.error.data,
            searchClientVisible: false,
            searchPolicyVisible: false,
            clientEditVisible: false,
            activeTab: "form_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.error != prevProps.error) {
            this.setState({
                error: this.props.error,
                errorData: this.props.error.data,
                activeTab: "form_tab",
            });
        }
    }

    handleChange = (fieldName: keyof CommissionErrorEdit, value: any) => {
        const error = update(this.state.error, { [fieldName]: { $set: value } });
        this.setState({
            error: error,
        });
        this.props.onChange(error);
    };

    newClient = () => {
        const { errorData } = this.state;

        const client = newClient({
            firstName: errorData.firstName || "",
            lastName: errorData.lastName || errorData.fullName || "",
            dateOfBirth: errorData.dateOfBirth || "",
            idNumber: errorData.idNumber || "",
            initials: errorData.initials || "",
        });
        this.props.dispatch(receiveClient(client));
        this.toggleClientEditVisible();
    };

    newPolicy = () => {
        if (!this.state.error.clientId) return;

        const policy = newPolicy({
            clientId: this.state.error.clientId,
            companyId: this.props.statement.companyId,
            number: this.state.errorData.policyNumber,
        });
        this.props.dispatch(receivePolicy(policy));
    };

    clientInserted = (client: ClientEdit) => {
        this.selectClient(client.id);
    };

    policyInserted = (policy: PolicyEdit) => {
        this.selectPolicy(policy.id);
    };

    selectClient = (clientId: string) => {
        //If the client changes clear the policy
        if (clientId != this.state.error.clientId) this.selectPolicy(null);

        this.handleChange("clientId", clientId);
    };

    selectPolicy = (policyId: string | null) => {
        this.handleChange("policyId", policyId);
    };

    toggleSearchClientVisible = () => {
        this.setState({
            searchClientVisible: !this.state.searchClientVisible,
        });
    };

    toggleSearchPolicyVisible = () => {
        this.setState({
            searchPolicyVisible: !this.state.searchPolicyVisible,
        });
    };

    toggleClientEditVisible = () => {
        this.setState({
            clientEditVisible: !this.state.clientEditVisible,
        });
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { validationResults } = this.props;
        const { error } = this.state;

        return (
            <>
                <Tabs
                    onChange={this.onTabChange}
                    activeKey={this.state.activeTab}
                    sticky={true}
                >
                    <TabPane tab="Mapping" key="form_tab">
                        <Form editUseCase="com_edit_commission_statements">
                            <FormText
                                fieldName="clientId"
                                label="Client"
                                value={
                                    error.clientId ? (
                                        <ClientName
                                            clientId={error.clientId}
                                            className="text-success"
                                        />
                                    ) : null
                                }
                                emptyValueText={
                                    <span className="text-error">
                                        No Mapped Client
                                    </span>
                                }
                                validationResults={validationResults}
                                extra={
                                    <>
                                        <Button
                                            size="small"
                                            icon="search"
                                            type={
                                                this.state.error.clientId
                                                    ? "dashed"
                                                    : "primary"
                                            }
                                            onClick={
                                                this.toggleSearchClientVisible
                                            }
                                        >
                                            Find Client
                                        </Button>
                                        <Button
                                            size="small"
                                            icon="plus"
                                            type={
                                                this.state.error.clientId
                                                    ? "dashed"
                                                    : "primary"
                                            }
                                            onClick={this.newClient}
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
                                        <PolicyName
                                            policyId={error.policyId}
                                            className="text-success"
                                        />
                                    ) : null
                                }
                                emptyValueText={
                                    <span className="text-error">
                                        No Mapped Policy
                                    </span>
                                }
                                validationResults={validationResults}
                                extra={
                                    <>
                                        <Button
                                            size="small"
                                            icon="search"
                                            type={
                                                this.state.error.policyId
                                                    ? "dashed"
                                                    : "primary"
                                            }
                                            onClick={
                                                this.toggleSearchPolicyVisible
                                            }
                                            disabled={
                                                !this.state.error.clientId
                                            }
                                        >
                                            Find Policy
                                        </Button>
                                        <Button
                                            size="small"
                                            icon="plus"
                                            type={
                                                this.state.error.policyId
                                                    ? "dashed"
                                                    : "primary"
                                            }
                                            onClick={this.newPolicy}
                                            disabled={
                                                !this.state.error.clientId
                                            }
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
                                        <CommissionTypeName
                                            commissionTypeId={
                                                error.commissionTypeId
                                            }
                                        />
                                    ) : null
                                }
                                emptyValueText={
                                    <span className="text-error">
                                        No Mapped Commission Type
                                    </span>
                                }
                                validationResults={validationResults}
                            />
                        </Form>
                    </TabPane>

                    <TabPane tab="Excel Data" key="data_tab">
                        <FormReadOnly data={error.data} />
                    </TabPane>
                </Tabs>

                <EditClient
                    onClientInserted={this.clientInserted}
                    visible={this.state.clientEditVisible}
                    onClose={this.toggleClientEditVisible}
                />
                <EditPolicy onPolicyInserted={this.policyInserted} />

                <Drawer
                    title="Client Search"
                    visible={this.state.searchClientVisible}
                    onClose={this.toggleSearchClientVisible}
                >
                    <ClientSearch
                        defaultSearchText={this.state.errorData.lastName || ""}
                        onSelect={(clientId: string) => {
                            this.selectClient(clientId);
                            this.toggleSearchClientVisible();
                        }}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleSearchClientVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>

                <Drawer
                    title="Policy Search"
                    visible={this.state.searchPolicyVisible}
                    onClose={this.toggleSearchPolicyVisible}
                >
                    <PolicySearch
                        onSelect={(policyId: string) => {
                            this.selectPolicy(policyId);
                            this.toggleSearchPolicyVisible();
                        }}
                        clientId={this.state.error.clientId}
                        companyId={this.props.statement.companyId}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleSearchPolicyVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

export default connect()(MappingErrorForm);
