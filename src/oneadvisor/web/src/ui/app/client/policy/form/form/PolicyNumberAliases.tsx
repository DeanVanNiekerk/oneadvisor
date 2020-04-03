import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { modifyPolicy, PolicyEdit, policySelector } from "@/state/client/policies";
import { RootState } from "@/state/rootReducer";
import { FormSimpleList } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const PolicyNumberAliases: React.FC<Props> = (props: Props) => {
    const { policy, handleChange, validationResults } = props;

    if (!policy) return <React.Fragment />;

    const onChange = (fieldName: keyof PolicyEdit, value: string[]) => {
        handleChange(policy, fieldName, value);
    };

    return (
        <>
            <FormSimpleList
                editUseCase="clt_edit_policies"
                fieldName="numberAliases"
                displayName="Policy Number Alias"
                values={policy.numberAliases}
                onChange={(aliases: string[]) => onChange("numberAliases", aliases)}
                validationResults={validationResults}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyState = policySelector(state);
    return {
        policy: policyState.policy,
        validationResults: policyState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (policy: PolicyEdit, fieldName: keyof PolicyEdit, value: string[]) => {
            const policyModified = update(policy, { [fieldName]: { $set: value } });
            dispatch(modifyPolicy(policyModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyNumberAliases);
