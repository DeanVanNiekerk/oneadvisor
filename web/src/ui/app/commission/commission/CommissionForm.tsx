import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';
import { connect, DispatchProp } from 'react-redux';

import { applyLikeFormat } from '@/app/query';
import { Filters } from '@/app/table';
import { ValidationResult } from '@/app/validation';
import { getPolicies, Policy } from '@/state/app/client/policies';
import { CommissionEdit } from '@/state/app/commission/commissions';
import { CommissionType, commissionTypesSelector } from '@/state/app/commission/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Form, FormInputNumber, FormReadOnly, FormSelect, TabPane, Tabs } from '@/ui/controls';

type TabKey = "form_tab" | "data_tab";

type Props = {
    commission: CommissionEdit;
    validationResults: ValidationResult[];
    onChange: (client: CommissionEdit) => void;
    commissionTypes: CommissionType[];
    users: UserSimple[];
} & DispatchProp;

type State = {
    commission: CommissionEdit;
    policies: Policy[];
    activeTab: TabKey;
};

class CommissionForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commission: props.commission,
            policies: [],
            activeTab: "form_tab",
        };

        this.loadPolicy(this.props.commission.policyId);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commission != prevProps.commission) {
            this.setState({
                commission: this.props.commission,
                activeTab: "form_tab",
            });
            this.loadPolicy(this.props.commission.policyId);
        }
    }

    handleChange = async (fieldName: string, value: any) => {
        const commission = {
            ...this.state.commission,
            [fieldName]: value,
        };
        this.setState({
            commission: commission,
        });
        this.props.onChange(commission);
    };

    loadPolicy = (policyId: string) => {
        if (!policyId) return;

        const filters = {
            id: [policyId],
        };
        this.loadPolicies(filters);
    };

    loadPolicies = (filters: Filters) => {
        const pageOptions = {
            number: 1,
            size: 20, //Limit to 20 records
        };
        this.props.dispatch(
            getPolicies(filters, pageOptions, policies => {
                this.setState({
                    policies: policies,
                });
            })
        );
    };

    policySearch = (value: string) => {
        if (value === "") {
            //Some reason when selecting 
            return;
        }
        if (value.length < 3) {
            this.handleChange("policyId", "");
            this.setState({
                policies: [],
            });
            return;
        }
        const filters = { number: [applyLikeFormat(value)] };
        this.loadPolicies(filters);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { validationResults } = this.props;
        const { commission } = this.state;

        return (
            <Tabs
                onChange={this.onTabChange}
                activeKey={this.state.activeTab}
                sticky={true}
            >
                <TabPane tab="Commission" key="form_tab">
                    <Form editUseCase="com_edit_commissions">
                        <FormSelect
                            showSearch={true}
                            showArrow={false}
                            filterOption={false}
                            defaultActiveFirstOption={false}
                            placeholder={"Select Policy"}
                            notFoundContent={null}
                            fieldName="policyId"
                            onSearch={this.policySearch}
                            label="Policy"
                            value={commission.policyId}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            options={this.state.policies}
                            optionsValue="id"
                            optionsText="number"
                            autoFocus={true}
                            disabled={true}
                        />
                        <FormSelect
                            fieldName="userId"
                            label="Broker"
                            value={commission.userId}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            options={this.props.users}
                            optionsValue="id"
                            optionsText="fullName"
                        />
                        <FormSelect
                            fieldName="commissionTypeId"
                            label="Type"
                            value={commission.commissionTypeId}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            options={this.props.commissionTypes}
                            optionsValue="id"
                            optionsText="name"
                        />
                        <FormInputNumber
                            fieldName="amountIncludingVAT"
                            label="Amount (incl VAT)"
                            value={commission.amountIncludingVAT}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            min={0}
                        />
                        <FormInputNumber
                            fieldName="vat"
                            label="VAT"
                            value={commission.vat}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            min={0}
                        />
                    </Form>
                </TabPane>

                <TabPane tab="Excel Data" key="data_tab">
                    {!commission.sourceData && <span>No Source Data</span>}
                    {commission.sourceData && (
                        <FormReadOnly data={commission.sourceData} />
                    )}
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionTypeState = commissionTypesSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        commissionTypes: commissionTypeState.items,
        users: usersState.items,
    };
};

export default connect(mapStateToProps)(CommissionForm);
