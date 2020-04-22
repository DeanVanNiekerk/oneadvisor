import { Alert, Divider } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    policiesSelector,
    PolicyEdit,
    policyMergeSelector,
    receivePolicy,
    saveMergePolicies,
} from "@/state/client/policies";
import { MergeCellsOutlined } from "@ant-design/icons";

import PolicyForm from "../../form/form/PolicyForm";
import { PolicyMergeSteps } from "../PolicyMergeSteps";

type Props = {
    nextStep: () => void;
    previousStep: () => void;
} & PropsFromState &
    PropsFromDispatch;

const PolilcyDetails: React.FC<Props> = (props) => {
    useEffect(() => {
        loadMergedPolicy();
    }, []);

    const loadMergedPolicy = () => {
        const policy = props.policies[0];

        //Use the first policy as the base
        let policyEdit: PolicyEdit = {
            id: null,
            clientId: policy.clientId,
            companyId: policy.companyId,
            isActive: policy.isActive,
            number: policy.number,
            numberAliases: [],
            policyProductId: policy.policyProductId,
            policyProductTypeId: policy.policyProductTypeId,
            policyTypeId: policy.policyTypeId,
            premium: policy.premium,
            startDate: policy.startDate,
            userId: policy.userId,
        };

        //Pick up props from other policies if not set on the first one
        props.policies.forEach((p) => {
            policyEdit = {
                ...policyEdit,
                startDate: !policyEdit.startDate ? p.startDate : policyEdit.startDate,
                premium: !policyEdit.premium ? p.premium : policyEdit.premium,
            };
        });

        let numberAliases = [] as string[];

        //Load up aliases
        props.policies.forEach((p) => {
            numberAliases.push(p.number);
            numberAliases.push(...p.numberAliases);
        });
        //Filter out the policy number
        numberAliases = numberAliases.filter((n) => n !== policyEdit.number);
        //Make unique
        numberAliases = [...new Set(numberAliases)];

        policyEdit.numberAliases = numberAliases;

        props.receivePolicy(policyEdit);
    };

    const save = () => {
        props.saveMergePolicies(() => {
            props.nextStep();
        });
    };

    return (
        <>
            <PolicyMergeSteps
                currentStepIndex={1}
                nextIcon={<MergeCellsOutlined />}
                nextText="Merge"
                onNext={save}
                onPrevious={props.previousStep}
                nextDisabled={props.merging}
                previousDisabled={props.merging}
            />

            <Divider />

            <Alert
                message="Please confirm that the Policy Number and the Aliases are correct."
                type="info"
                showIcon
                className="mb-1"
            />

            <PolicyForm />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policiesState = policiesSelector(state);
    return {
        policies: policiesState.selectedPolicies,
        merging: policyMergeSelector(state).fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ receivePolicy, saveMergePolicies }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolilcyDetails);
