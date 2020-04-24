import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import { AdviceScopeEdit, adviceScopeSelector, modifyAdviceScope } from "@/state/lookups/directory";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AdviceScopeForm: React.FC<Props> = ({ adviceScope, validationResults, handleChange }) => {
    if (!adviceScope) return <React.Fragment />;

    const onChange = (fieldName: keyof AdviceScopeEdit, value: string) => {
        handleChange(adviceScope, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="name"
                label="Name"
                value={adviceScope.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const adviceScopeState = adviceScopeSelector(state);
    return {
        adviceScope: adviceScopeState.adviceScope,
        validationResults: adviceScopeState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            adviceScope: AdviceScopeEdit,
            fieldName: keyof AdviceScopeEdit,
            value: string
        ) => {
            const adviceScopeModified = update(adviceScope, {
                [fieldName]: { $set: value },
            });
            dispatch(modifyAdviceScope(adviceScopeModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdviceScopeForm);
