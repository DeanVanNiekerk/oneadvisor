import update from "immutability-helper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { applyLikeFormat } from "@/app/query";
import { Filters, PageOptions } from "@/app/table";
import { getPolicies, Policy } from "@/state/client/policies";
import {
    CommissionEdit,
    commissionSelector,
    modifyCommission,
} from "@/state/app/commission/commissions";
import { commissionTypesSelector } from "@/state/app/commission/lookups";
import { brokersSelector } from "@/state/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Form, FormInputNumber, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const CommissionDetails: React.FC<Props> = (props: Props) => {
    const { commission } = props;

    if (!commission) return <React.Fragment />;

    const [policies, setPolicies] = useState<Policy[]>([]);

    useEffect(() => {
        loadPolicy(commission.policyId);
    }, [commission.policyId]);

    const onChange = (fieldName: keyof CommissionEdit, value: string | number | undefined) => {
        props.handleChange(commission, fieldName, value);
    };

    const loadPolicy = (policyId: string) => {
        if (!policyId) return;

        const filters = {
            id: [policyId],
        };
        loadPolicies(filters);
    };

    const loadPolicies = (filters: Filters) => {
        const pageOptions = {
            number: 1,
            size: 20, //Limit to 20 records
        };
        props.getPolicies(filters, pageOptions, (policies) => {
            setPolicies(policies);
        });
    };

    const policySearch = (value: string) => {
        if (value === "") {
            //Some reason when selecting
            return;
        }
        if (value.length < 3) {
            onChange("policyId", "");
            setPolicies([]);
            return;
        }
        const filters = { number: [applyLikeFormat(value)] };
        loadPolicies(filters);
    };

    return (
        <Form editUseCase="com_edit_commissions">
            <FormSelect<string>
                showSearch={true}
                showArrow={false}
                filterOption={false}
                defaultActiveFirstOption={false}
                placeholder={"Select Policy"}
                notFoundContent={null}
                fieldName="policyId"
                onSearch={policySearch}
                label="Policy"
                value={commission.policyId}
                onChange={onChange}
                validationResults={props.validationResults}
                options={policies}
                optionsValue="id"
                optionsText="number"
                autoFocus={true}
                disabled={true}
            />
            <FormSelect<string>
                fieldName="userId"
                label="Broker"
                value={commission.userId}
                onChange={onChange}
                validationResults={props.validationResults}
                options={props.users}
                optionsValue="id"
                optionsText="fullName"
            />
            <FormSelect<string>
                fieldName="commissionTypeId"
                label="Type"
                value={commission.commissionTypeId}
                onChange={onChange}
                validationResults={props.validationResults}
                options={props.commissionTypes}
                optionsValue="id"
                optionsText="name"
            />
            <FormInputNumber
                fieldName="amountIncludingVAT"
                label="Amount (incl VAT)"
                value={commission.amountIncludingVAT}
                onChange={onChange}
                validationResults={props.validationResults}
            />
            <FormInputNumber
                fieldName="vat"
                label="VAT"
                value={commission.vat}
                onChange={onChange}
                validationResults={props.validationResults}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const commissionState = commissionSelector(state);
    const commissionTypeState = commissionTypesSelector(state);
    return {
        commission: commissionState.commission,
        validationResults: commissionState.validationResults,
        commissionTypes: commissionTypeState.items,
        users: brokersSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            commission: CommissionEdit,
            fieldName: keyof CommissionEdit,
            value: string | number | undefined
        ) => {
            const commissionModified = update(commission, { [fieldName]: { $set: value } });
            dispatch(modifyCommission(commissionModified));
        },
        getPolicies: (
            filters: Filters,
            pageOptions: PageOptions,
            onSuccess: (policies: Policy[]) => void
        ) => {
            dispatch(getPolicies(filters, pageOptions, onSuccess));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommissionDetails);
